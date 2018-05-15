/// <reference types="ws" />
/// <reference types="node" />
import * as WebSocket from "ws";
import { IConfig } from "../../config";
import { IConnection } from "./interfaces";
export interface IConnectionManager {
    stats: {
        total: number;
    };
    create(socket: WebSocket): number;
    terminate(connId: number): void;
    exists(connId: number): boolean;
    sendMessage(connId: number, type: number, payload?: any): Promise<void>;
}
/**
 * Connection manager service
 */
export declare class ConnectionManager implements IConnectionManager {
    stats: {
        total: number;
    };
    protected index: number;
    protected connections: Map<number, IConnection>;
    constructor(config: IConfig);
    /**
     * creates connection
     * @param {WebSocket} socket
     * @returns {number}
     */
    create(socket: WebSocket): number;
    /**
     * terminates connection
     * @param {number} connId
     */
    terminate(connId: number): void;
    /**
     * checks if connection exists
     * @param {number} connId
     * @returns {boolean}
     */
    exists(connId: number): boolean;
    /**
     * send message to connection
     * @param {number} connId
     * @param {number} type
     * @param {Buffer} payload
     * @returns {Promise<void>}
     */
    sendMessage(connId: number, type: number, payload?: Buffer): Promise<void>;
    protected heartbeatHandler(): void;
    protected pongHandler(this: IConnection): void;
}
