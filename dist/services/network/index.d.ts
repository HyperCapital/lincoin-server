/// <reference types="web3" />
import * as Web3 from "web3";
import { Api, IApi } from "eth-api";
import { IConfig } from "../../config";
export interface INetwork extends IApi {
    web3: Web3.IWeb3;
}
/**
 * Network service
 */
export declare class Network extends Api implements INetwork {
    readonly web3: Web3.IWeb3;
    constructor(config: IConfig);
}
