/// <reference types="web3" />
import * as Web3 from "web3";
import { BigNumber } from "bignumber.js";
export interface IContractModel {
    address: string;
    getBalance(): Promise<BigNumber>;
    getData(method: string, ...args: any[]): string;
    call(method: string, ...args: any[]): Promise<any>;
    watch(filter: any, additionalFilter: any, callback: (err: any, log: any) => void): any;
}
export declare class ContractModel implements IContractModel {
    private web3;
    address: string;
    private readonly contract;
    constructor(web3: Web3.IWeb3, address: string, abi: Web3.TAbi);
    getBalance(): Promise<BigNumber>;
    getData(method: string, ...args: any[]): string;
    call(method: string, ...args: any[]): Promise<any>;
    watch(filter: any, additionalFilter: any, callback: (err: any, log: any) => void): void;
}
