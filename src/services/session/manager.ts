import { randomBytes } from "crypto";
import { recover } from "secp256k1";
import { injectable } from "inversify";
import { publicKeyToAddress, bufferToHex } from "../../utils";

export interface ISessionManager {
  stats: {
    total: number;
    verified: number;
  };
  create(connId: number): Buffer;
  destroy(connId: number): void;
  verify(connId: number, signature: Buffer, recovery: number): boolean;
  getAddressConnectionId(address: string): number;
  getHashAddress(hash: string): string;
  getAllConnectionIds(): number[];
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

  protected connHashMap = new Map<number, Buffer>();
  protected connAddressMap = new Map<number, string>();
  protected addressConnMap = new Map<string, number>();
  protected hashAddressMap = new Map<string, string>();

  /**
   * creates session
   * @param {number} connId
   * @returns {Buffer}
   */
  public create(connId: number): Buffer {
    const result = randomBytes(32);

    this.connHashMap.set(connId, result);

    ++this.stats.total;

    return result;
  }

  /**
   * destroys session
   * @param {number} connId
   */
  public destroy(connId: number): void {
    if (this.connAddressMap.has(connId)) {
      const hash = this.connHashMap.get(connId);
      const address = this.connAddressMap.get(connId);

      this.connAddressMap.delete(connId);
      this.addressConnMap.delete(address);
      this.hashAddressMap.delete(bufferToHex(hash));

      --this.stats.verified;
    }

    this.connHashMap.delete(connId);

    --this.stats.total;
  }

  /**
   * verifies session
   * @param {number} connId
   * @param {Buffer} signature
   * @param {number} recovery
   * @returns {boolean}
   */
  public verify(connId: number, signature: Buffer, recovery: number): boolean {
    let result = false;

    if (
      this.connHashMap.has(connId) &&
      !this.connAddressMap.has(connId)
    ) {
      const hash = this.connHashMap.get(connId);

      try {
        const publicKey = recover(hash, signature, recovery, false);
        const address = publicKeyToAddress(publicKey);

        if (!this.addressConnMap.has(address)) {
          this.connAddressMap.set(connId, address);
          this.addressConnMap.set(address, connId);
          this.hashAddressMap.set(bufferToHex(hash), address);

          ++this.stats.verified;

          result = true;
        }
      } catch (err) {
        result = false;
      }
    }

    return result;
  }

  /**
   * gets address connection id
   * @param {string} address
   * @returns {number}
   */
  public getAddressConnectionId(address: string): number {
    return this.addressConnMap.get(address) || null;
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
   * gets all connection ids
   * @returns {number[]}
   */
  public getAllConnectionIds(): number[] {
    return [
      ...this.connAddressMap.keys(),
    ];
  }
}
