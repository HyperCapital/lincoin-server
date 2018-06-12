import * as Web3 from "web3";
import { INetwork } from "../network";
import { BigNumber } from "bignumber.js";

export interface IContractModel {
  contract: Web3.IContract;
  address: string;
  getData(method: string, ...args: any[]): string;
  estimateGas(method: string, ...args: any[]): BigNumber;
  call(method: string, ...args: any[]): Promise<any>;
  watch(filter: any, additionalFilter: any, callback: (err: any, log: any) => void);
}

export class ContractModel implements IContractModel {
  public readonly contract: Web3.IContract;

  constructor(network: INetwork, public address: string, abi: Web3.TAbi) {
    this.contract = network.web3.eth.contract(abi).at(address);
  }

  public getData(method: string, ...args: any[]): string {
    return this.contract[ method ].getData(...args);
  }

  public estimateGas(method: string, ...args: any[]): BigNumber {
    return this.contract[ method ].estimateGas(...args);
  }

  public call(method: string, ...args: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.contract[ method ](...args, (err, ...result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public watch(filter: any, additionalFilter: any, callback: (err: any, log: any) => void) {
    this.contract.allEvents(
      filter || null,
      additionalFilter || {
        fromBlock: "latest",
      },
      callback,
    );
  }
}
