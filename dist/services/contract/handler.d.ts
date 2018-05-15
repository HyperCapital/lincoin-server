/// <reference types="winston" />
import { LoggerInstance } from "winston";
import { IConfig } from "../../config";
import { INetworkManager } from "../network";
import { IContractController } from "./interfaces";
/**
 * Contract handler service
 */
export declare class ContractHandler {
    private eventHandlers;
    constructor(config: IConfig, logger: LoggerInstance, networkManager: INetworkManager, controllers: IContractController[]);
    private eventHandler(contract, network, log);
}
