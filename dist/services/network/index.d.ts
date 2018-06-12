/// <reference types="web3" />
import * as Web3 from "web3";
import { IConfig } from "../../config";
export interface INetwork {
    web3: Web3.IWeb3;
}
/**
 * Network service
 */
export declare class Network implements INetwork {
    readonly web3: Web3.IWeb3;
    constructor(config: IConfig);
}
