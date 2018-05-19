/// <reference types="node" />
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
    getAllConnections(exceptAddresses?: string[]): Array<Partial<IConnection>>;
}
/**
 * Session manager service
 */
export declare class SessionManager implements ISessionManager {
    stats: {
        total: number;
        verified: number;
    };
    protected connIdHashMap: Map<number, Buffer>;
    protected connIdAddressMap: Map<number, string>;
    protected addressConnIdsMap: Map<string, number[]>;
    protected hashAddressMap: Map<string, string>;
    /**
     * creates session
     * @param {IConnection} conn
     * @returns {Buffer}
     */
    create({id}: IConnection): Buffer;
    /**
     * destroys session
     * @param {IConnection} conn
     */
    destroy({id}: IConnection): void;
    /**
     * verifies session
     * @param {IConnection} conn
     * @param {Buffer} signature
     * @param {number} recovery
     * @returns {string}
     */
    verify({id}: IConnection, signature: Buffer, recovery: number): string;
    /**
     * gets hash address
     * @param {string} hash
     * @returns {string}
     */
    getHashAddress(hash: string): string;
    /**
     * gets address connection id
     * @param {string} address
     * @returns {Array<Partial<IConnection>>}
     */
    getAddressConnections(address: string): Array<Partial<IConnection>>;
    /**
     * gets all connection ids
     * @param {string[]} exceptAddresses
     * @returns {Array<Partial<IConnection>>}
     */
    getAllConnections(exceptAddresses?: string[]): Array<Partial<IConnection>>;
}
