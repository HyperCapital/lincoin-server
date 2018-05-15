/// <reference types="node" />
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
export declare class SessionManager implements ISessionManager {
    stats: {
        total: number;
        verified: number;
    };
    protected connHashMap: Map<number, Buffer>;
    protected connAddressMap: Map<number, string>;
    protected addressConnIdsMap: Map<string, number[]>;
    protected hashAddressMap: Map<string, string>;
    /**
     * creates session
     * @param {number} connId
     * @returns {Buffer}
     */
    create(connId: number): Buffer;
    /**
     * destroys session
     * @param {number} connId
     */
    destroy(connId: number): void;
    /**
     * verifies session
     * @param {number} connId
     * @param {Buffer} signature
     * @param {number} recovery
     * @returns {string}
     */
    verify(connId: number, signature: Buffer, recovery: number): string;
    /**
     * gets address connection id
     * @param {string} address
     * @returns {number}
     */
    getAddressConnectionIds(address: string): number[];
    /**
     * gets hash address
     * @param {string} hash
     * @returns {string}
     */
    getHashAddress(hash: string): string;
    /**
     * gets all connection ids
     * @returns {number[]}
     */
    getAllConnectionIds(): number[];
}
