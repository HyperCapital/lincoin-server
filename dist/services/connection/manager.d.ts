/// <reference types="ws" />
/// <reference types="node" />
import * as WebSocket from "ws";
import { IConnection } from "./interfaces";
export interface IConnectionManager {
    stats: {
        total: number;
    };
    create(socket: WebSocket): IConnection;
    terminate(conn: Partial<IConnection>): void;
    exists(conn: Partial<IConnection>): boolean;
    isMuted(conn: Partial<IConnection>): boolean;
    toggleMuted(conn: Partial<IConnection>): boolean;
    sendMessage(conn: Partial<IConnection>, type: number, payload?: any): Promise<boolean>;
}
/**
 * Connection manager service
 */
export declare class ConnectionManager implements IConnectionManager {
    stats: {
        total: number;
        muted: number;
    };
    protected index: number;
    protected connections: Map<number, IConnection>;
    /**
     * creates connection
     * @param {WebSocket} socket
     * @returns {IConnection}
     */
    create(socket: WebSocket): IConnection;
    /**
     * terminates connection
     * @param {Partial<IConnection>} conn
     */
    terminate({id}: Partial<IConnection>): void;
    /**
     * checks if connection exists
     * @param {Partial<IConnection>} conn
     * @returns {boolean}
     */
    exists({id}: Partial<IConnection>): boolean;
    /**
     * checks if connection is muted
     * @param {number} id
     * @returns {boolean}
     */
    isMuted({id}: Partial<IConnection>): boolean;
    /**
     * toggle muted
     * @param {number} id
     * @param {boolean} muted
     * @returns {boolean}
     */
    toggleMuted({id, muted}: Partial<IConnection>): boolean;
    /**
     * send message to connection
     * @param {Partial<IConnection>} conn
     * @param {number} type
     * @param {Buffer} payload
     * @returns {Promise<boolean>}
     */
    sendMessage({id}: Partial<IConnection>, type: number, payload?: Buffer): Promise<boolean>;
}
