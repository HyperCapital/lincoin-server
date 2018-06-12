import { ProviderOptions } from "apn";
import { LoggerOptions } from "winston";
import { ServerOptions as WsServerOptions } from "ws";
import { ContractTypes } from "./services";

export interface IConfig {
  apn?: {
    provider?: ProviderOptions;
    providers?: Array<{
      id?: string;
    } & ProviderOptions>;
  };
  contracts?: Array<{
    id?: string;
    type?: ContractTypes;
    abi?: any;
    address: string;
    handler?: {
      filter?: any;
      additionalFilter?: any;
    };
  }>;
  httpServer?: {
    port: number;
  };
  logger?: LoggerOptions;
  network?: {
    endpoint: string;
  };
  wsServer?: WsServerOptions;
}
