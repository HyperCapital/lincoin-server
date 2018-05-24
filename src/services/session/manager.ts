import { randomBytes } from "crypto";
import { injectable } from "inversify";
import { recover } from "secp256k1";
import { bufferToHex, publicKeyToAddress } from "../../utils";
import { IConnection } from "../connection";
import { ISession } from "./interfaces";

export interface ISessionManager {
  stats: {
    total: number;
    verified: number;
  };
  create(conn: IConnection): ISession;
  destroy(conn: IConnection): void;
  verify(conn: IConnection, signature: Buffer, recovery: number): ISession;
  unverify(conn: IConnection): void;
  getConnectionSession(conn: IConnection): ISession;
  getHashSession(hash: string): ISession;
  getAddressConnections(address: string): IConnection[];
  getAllAddressesConnections(exceptAddresses?: string[]): IConnection[];
}

/**
 * Session manager service
 */
@injectable()
export class SessionManager implements ISessionManager {
  public stats = {
    total: 0,
    verified: 0,
  };

  protected connIdSessionMap = new Map<number, ISession>();
  protected hashSessionMap = new Map<string, ISession>();
  protected addressSessionsMap = new Map<string, ISession[]>();

  /**
   * creates session
   * @param {IConnection} conn
   * @returns {ISession}
   */
  public create(conn: IConnection): ISession {
    const { id } = conn;
    const hash = randomBytes(32);
    const result: ISession = {
      conn,
      hash,
    };

    this.connIdSessionMap.set(id, result);
    this.hashSessionMap.set(bufferToHex(hash), result);

    ++this.stats.total;

    return result;
  }

  /**
   * destroys session
   * @param {IConnection} conn
   */
  public destroy({ id }: IConnection): void {
    if (!this.connIdSessionMap.has(id)) {
      return;
    }

    const {
      hash,
      address,
    } = this.connIdSessionMap.get(id);

    this.hashSessionMap.delete(bufferToHex(hash));

    if (address && this.removeConnectionAddress(id, address)) {
      --this.stats.verified;
    }

    this.connIdSessionMap.delete(id);
    --this.stats.total;
  }

  /**
   * verifies session
   * @param {IConnection} conn
   * @param {Buffer} signature
   * @param {number} recovery
   * @returns {ISession}
   */
  public verify({ id }: IConnection, signature: Buffer, recovery: number): ISession {
    let result = this.connIdSessionMap.get(id) || null;

    if (result) {
      try {
        const publicKey = recover(result.hash, signature, recovery, false);
        const address = publicKeyToAddress(publicKey);

        if (
          !result.address ||
          result.address !== address
        ) {

          if (result.address && this.removeConnectionAddress(id, result.address)) {
            --this.stats.verified;
          }

          result.address = address;
          result.publicKey = publicKey;

          this.addressSessionsMap.set(address, [
            ...this.addressSessionsMap.get(address) || [],
            result,
          ]);

          ++this.stats.verified;
        }

      } catch (e) {
        result = null;
      }
    }

    return result;
  }

  public unverify({ id }: IConnection): void {
    const session = this.connIdSessionMap.get(id) || null;

    if (
      session &&
      session.address &&
      this.removeConnectionAddress(id, session.address)
    ) {
      session.address = null;
      session.publicKey = null;

      --this.stats.verified;
    }
  }

  /**
   * gets connection session
   * @param {IConnection} conn
   * @returns {string}
   */
  public getConnectionSession({ id }: IConnection): ISession {
    return this.connIdSessionMap.get(id) || null;
  }

  /**
   * gets hash session
   * @param {string} hash
   * @returns {ISession}
   */
  public getHashSession(hash: string): ISession {
    return this.hashSessionMap.get(hash) || null;
  }

  /**
   * gets address connections
   * @param {string} address
   * @returns {IConnection[]}
   */
  public getAddressConnections(address: string): IConnection[] {
    return (this.addressSessionsMap.get(address) || []).map(({ conn }) => conn);
  }

  /**
   * gets all addresses connections
   * @param {string[]} exceptAddresses
   * @returns {IConnection[]}
   */
  public getAllAddressesConnections(exceptAddresses?: string[]): IConnection[] {
    let result: IConnection[] = [];

    this.addressSessionsMap.forEach((sessions, address) => {
      if (!exceptAddresses || exceptAddresses.indexOf(address) === -1) {
        result = [
          ...result,
          ...sessions.map(({ conn }) => conn),
        ];
      }
    });

    return result;
  }

  private removeConnectionAddress(connId: number, address: string): boolean {
    let result = false;
    let addressSessions = this.addressSessionsMap.get(address) || [];

    if (addressSessions.length) {
      addressSessions = addressSessions.filter(({ conn }) => conn.id !== connId);

      if (addressSessions.length) {
        this.addressSessionsMap.set(address, addressSessions);
      } else {
        this.addressSessionsMap.delete(address);
      }

      result = true;
    }

    return result;
  }
}
