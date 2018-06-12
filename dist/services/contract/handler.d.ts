/// <reference types="winston" />
import { LoggerInstance } from "winston";
import { IConfig } from "../../config";
import { IContractController } from "./interfaces";
import { IContractManager } from "./manager";
/**
 * Contract handler service
 */
export declare class ContractHandler {
    private eventHandlers;
    constructor(config: IConfig, logger: LoggerInstance, contractManager: IContractManager, controllers: IContractController[]);
    private eventHandler(contract, log);
}
