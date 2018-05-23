/// <reference types="node" />
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
    getConnectionSession(conn: IConnection): ISession;
    getHashSession(hash: string): ISession;
    getAddressConnections(address: string): IConnection[];
    getAllAddressesConnections(exceptAddresses?: string[]): IConnection[];
}
/**
 * Session manager service
 */
export declare class SessionManager implements ISessionManager {
    stats: {
        total: number;
        verified: number;
    };
    protected connIdSessionMap: Map<number, ISession>;
    protected hashSessionMap: Map<string, ISession>;
    protected addressSessionsMap: Map<string, ISession[]>;
    /**
     * creates session
     * @param {IConnection} conn
     * @returns {ISession}
     */
    create(conn: IConnection): ISession;
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
     * @returns {ISession}
     */
    verify({id}: IConnection, signature: Buffer, recovery: number): ISession;
    /**
     * gets connection session
     * @param {IConnection} conn
     * @returns {string}
     */
    getConnectionSession({id}: IConnection): ISession;
    /**
     * gets hash session
     * @param {string} hash
     * @returns {ISession}
     */
    getHashSession(hash: string): ISession;
    /**
     * gets address connections
     * @param {string} address
     * @returns {IConnection[]}
     */
    getAddressConnections(address: string): IConnection[];
    /**
     * gets all addresses connections
     * @param {string[]} exceptAddresses
     * @returns {IConnection[]}
     */
    getAllAddressesConnections(exceptAddresses?: string[]): IConnection[];
    private removeConnectionAddress(connId, address);
}
