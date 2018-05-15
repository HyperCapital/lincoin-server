/// <reference types="winston" />
/// <reference types="ws" />
import { ServerOptions as WsServerOptions } from "ws";
import { LoggerOptions } from "winston";
import { ContractTypes } from "./services";
export interface IConfig {
    apn?: {
        id: number;
    };
    connection?: {
        heartbeatInterval: number;
    };
    contracts?: Array<{
        id?: string;
        type?: ContractTypes;
        abi?: any;
        filter?: any;
        additionalFilter?: any;
        addresses: Array<{
            network: number;
            address: string;
        }>;
    }>;
    logger?: LoggerOptions;
    networks?: Array<{
        id: number;
        endpoint: string;
    }>;
    wsServer?: WsServerOptions;
}
