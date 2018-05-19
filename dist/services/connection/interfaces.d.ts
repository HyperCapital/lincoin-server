/// <reference types="ws" />
import * as WebSocket from "ws";
import { ConnectionEventHandlerTypes } from "./constants";
export interface IConnection {
    id: number;
    socket: WebSocket;
    muted: boolean;
}
export interface IConnectionEventHandler<T = any> {
    type: ConnectionEventHandlerTypes;
    property: string;
    handler?: (...args: any[]) => Promise<void> | void;
    params?: T;
}
export interface IConnectionController {
    eventHandlers: IConnectionEventHandler[];
}
