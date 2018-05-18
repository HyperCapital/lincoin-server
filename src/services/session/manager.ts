import { randomBytes } from "crypto";
import { injectable } from "inversify";
import { bufferToHex, recoverAddress } from "../../utils";
import { IConnection } from "../connection";

export interface ISessionManager {
  stats: {
    total: number;
    verified: number;
  };
  create(conn: IConnection): Buffer;
  destroy(conn: IConnection): void;
  verify(conn: IConnection, signature: Buffer, recovery: number): string;
  getHashAddress(hash: string): string;
  getAddressConnections(address: string): Array<Partial<IConnection>>;
  getAllConnections(): Array<Partial<IConnection>>;
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

  protected connIdHashMap = new Map<number, Buffer>();
  protected connIdAddressMap = new Map<number, string>();
  protected addressConnIdsMap = new Map<string, number[]>();
  protected hashAddressMap = new Map<string, string>();

  /**
   * creates session
   * @param {IConnection} conn
   * @returns {Buffer}
   */
  public create({ id }: IConnection): Buffer {
    const result = randomBytes(32);

    this.connIdHashMap.set(id, result);

    ++this.stats.total;

    return result;
  }

  /**
   * destroys session
   * @param {IConnection} conn
   */
  public destroy({ id }: IConnection): void {
    if (this.connIdAddressMap.has(id)) {
      const hash = this.connIdHashMap.get(id);
      const address = this.connIdAddressMap.get(id);

      this.connIdAddressMap.delete(id);

      const addressConnIds = this.addressConnIdsMap
        .get(address)
        .filter((item) => item !== id);

      if (addressConnIds.length) {
        this.addressConnIdsMap.set(address, addressConnIds);
      } else {
        this.addressConnIdsMap.delete(address);
      }

      this.hashAddressMap.delete(bufferToHex(hash));

      --this.stats.verified;
    }

    this.connIdHashMap.delete(id);

    --this.stats.total;
  }

  /**
   * verifies session
   * @param {IConnection} conn
   * @param {Buffer} signature
   * @param {number} recovery
   * @returns {string}
   */
  public verify({ id }: IConnection, signature: Buffer, recovery: number): string {
    let result: string = null;

    if (
      this.connIdHashMap.has(id) &&
      !this.connIdAddressMap.has(id)
    ) {
      const hash = this.connIdHashMap.get(id);

      try {
        const address = recoverAddress(hash, signature, recovery);
        const addressConnIds = this.addressConnIdsMap.get(address) || [];

        if (addressConnIds.indexOf(id) === -1) {
          addressConnIds.push(id);

          this.connIdAddressMap.set(id, address);
          this.addressConnIdsMap.set(address, addressConnIds);
          this.hashAddressMap.set(bufferToHex(hash), address);

          ++this.stats.verified;

          result = address;
        }
      } catch (err) {
        result = null;
      }
    }

    return result;
  }

  /**
   * gets hash address
   * @param {string} hash
   * @returns {string}
   */
  public getHashAddress(hash: string): string {
    return this.hashAddressMap.get(hash) || null;
  }

  /**
   * gets address connection id
   * @param {string} address
   * @returns {Array<Partial<IConnection>>}
   */
  public getAddressConnections(address: string): Array<Partial<IConnection>> {
    return (this.addressConnIdsMap.get(address) || []).map((id) => ({
      id,
    }));
  }

  /**
   * gets all connection ids
   * @returns {Array<Partial<IConnection>>}
   */
  public getAllConnections(): Array<Partial<IConnection>> {
    return [
      ...this.connIdAddressMap.keys(),
    ].map((id) => ({
      id,
    }));
  }
}
