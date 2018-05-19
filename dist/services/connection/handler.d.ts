/// <reference types="ws" />
/// <reference types="winston" />
import { Server } from "ws";
import { LoggerInstance } from "winston";
import { IConnectionManager } from "./manager";
import { IConnectionController, IConnectionEventHandler } from "./interfaces";
/**
 * Connection handler service
 */
export declare class ConnectionHandler {
    protected readonly eventHandlers: IConnectionEventHandler[];
    constructor(wsServer: Server, logger: LoggerInstance, manager: IConnectionManager, controllers: IConnectionController[]);
    private openedHandler(conn);
    private closedHandler(conn);
    private messageHandler(conn, payload);
}
