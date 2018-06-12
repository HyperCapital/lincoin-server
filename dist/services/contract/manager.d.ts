/// <reference types="winston" />
import { LoggerInstance } from "winston";
import { IConfig } from "../../config";
import { INetwork } from "../network";
import { IContractModel } from "./model";
export interface IContractManager {
    get(id?: string): IContractModel;
}
/**
 * Contract handler service
 */
export declare class ContractManager implements IContractManager {
    private contracts;
    constructor(config: IConfig, logger: LoggerInstance, network: INetwork);
    /**
     * gets contract
     * @param {string} id
     * @returns {IContractModel}
     */
    get(id?: string): IContractModel;
}
