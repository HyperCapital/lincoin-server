/// <reference types="web3" />
import * as Web3 from "web3";
import { IConfig } from "../../config";
export interface INetworkManager {
    getWeb3(id: number): Web3.IWeb3;
}
/**
 * Network manager service
 */
export declare class NetworkManager implements INetworkManager {
    private web3Instances;
    constructor(config: IConfig);
    /**
     * gets network web3 instance
     * @param {number} id
     * @returns {module:web3.Web3.IWeb3}
     */
    getWeb3(id: number): Web3.IWeb3;
}
