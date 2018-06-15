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
    private network;
    private contracts;
    constructor(config: IConfig, network: INetwork);
    /**
     * gets contract
     * @param {string} id
     * @returns {IContractModel}
     */
    get(id?: string): IContractModel;
    /**
     * creates contract
     * @param {string} address
     * @param {any} abi
     * @returns {IContractModel}
     */
    create(address: string, abi: any): IContractModel;
}
