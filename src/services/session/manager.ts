import { randomBytes } from "crypto";
import { injectable } from "inversify";
import { bufferToHex, recoverAddress } from "../../utils";

export interface ISessionManager {
  stats: {
    total: number;
    verified: number;
  };
  create(connId: number): Buffer;
  destroy(connId: number): void;
  verify(connId: number, signature: Buffer, recovery: number): string;
  getAddressConnectionIds(address: string): number[];
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
  protected addressConnIdsMap = new Map<string, number[]>();
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

      const addressConnIds = this.addressConnIdsMap
        .get(address)
        .filter((item) => item !== connId);

      if (addressConnIds.length) {
        this.addressConnIdsMap.set(address, addressConnIds);
      } else {
        this.addressConnIdsMap.delete(address);
      }

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
   * @returns {string}
   */
  public verify(connId: number, signature: Buffer, recovery: number): string {
    let result: string = null;

    if (
      this.connHashMap.has(connId) &&
      !this.connAddressMap.has(connId)
    ) {
      const hash = this.connHashMap.get(connId);

      try {
        const address = recoverAddress(hash, signature, recovery);
        const addressConnIds = this.getAddressConnectionIds(address);

        if (addressConnIds.indexOf(connId) === -1) {
          addressConnIds.push(connId);

          this.connAddressMap.set(connId, address);
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
   * gets address connection id
   * @param {string} address
   * @returns {number}
   */
  public getAddressConnectionIds(address: string): number[] {
    return this.addressConnIdsMap.get(address) || [];
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
