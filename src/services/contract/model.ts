import * as Web3 from "web3";
import { BigNumber } from "bignumber.js";

export interface IContractModel {
  address: string;
  getBalance(): Promise<BigNumber>;
  getData(method: string, ...args: any[]): string;
  call(method: string, ...args: any[]): Promise<any>;
  watch(filter: any, additionalFilter: any, callback: (err: any, log: any) => void);
}

export class ContractModel implements IContractModel {
  private readonly contract: Web3.IContract;

  constructor(private web3: Web3.IWeb3, public address: string, abi: Web3.TAbi) {
    this.contract = web3.eth.contract(abi).at(address);
  }

  public getBalance(): Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      this.web3.eth.getBalance(this.address, (err, result: BigNumber) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public getData(method: string, ...args: any[]): string {
    return this.contract[ method ].getData(...args);
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
