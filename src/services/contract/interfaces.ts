import * as Web3 from "web3";

export interface IContractEventHandler<T = any> {
  type: string;
  property: string;
  handler?: (...args: any[]) => Promise<void> | void;
}

export interface IContractController {
  contract: string;
  eventHandlers: IContractEventHandler[];
}

export interface IContract {
  web3Contract: Web3.IContract;
  call(methodName: string, ...args: any[]): Promise<any[]>;
  getData(methodName: string, ...args: any[]): string;
}
