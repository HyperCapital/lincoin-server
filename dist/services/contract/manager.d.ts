/// <reference types="winston" />
import { LoggerInstance } from "winston";
import { IConfig } from "../../config";
import { INetwork } from "../network";
import { IContract } from "./interfaces";
export interface IContractManager {
    get(id: string): IContract;
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
     * @returns {IContract}
     */
    get(id: string): IContract;
}
