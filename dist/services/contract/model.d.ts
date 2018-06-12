/// <reference types="web3" />
import * as Web3 from "web3";
import { INetwork } from "../network";
import { BigNumber } from "bignumber.js";
export interface IContractModel {
    address: string;
    getData(method: string, ...args: any[]): string;
    estimateGas(method: string, ...args: any[]): BigNumber;
    call(method: string, ...args: any[]): Promise<any>;
    watch(filter: any, additionalFilter: any, callback: (err: any, log: any) => void): any;
}
export declare class ContractModel implements IContractModel {
    address: string;
    private readonly contract;
    constructor(network: INetwork, address: string, abi: Web3.TAbi);
    getData(method: string, ...args: any[]): string;
    estimateGas(method: string, ...args: any[]): BigNumber;
    call(method: string, ...args: any[]): Promise<any>;
    watch(filter: any, additionalFilter: any, callback: (err: any, log: any) => void): void;
}
