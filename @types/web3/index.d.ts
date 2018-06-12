declare module "web3" {
  import BigNumber from "bignumber.js";

  const Web3: {
    new(provider?: Web3.IProvider): Web3.IWeb3;
  };

  namespace Web3 {
    export interface IWeb3 {
      eth: {
        [ key: string ]: (...args: any[]) => void;
        contract(abi: any): {
          at(address: string): IContract;
        };
      };
      currentProvider: any;
      setProvider(provider: IProvider): void;
      isAddress(address: string): boolean;
      fromWei(value: any, unit: string): any;
      toWei(value: any, unit: string): any;
      sha3(...value: any[]): any;
    }

    export interface IAbiMethod {
      name: string;
      type: string;
    }

    export type TAbi = Array<{
      constant?: boolean;
      anonymous?: boolean;
      payable?: boolean;
      name: string;
      type?: string;
      inputs: IAbiMethod[];
      outputs: IAbiMethod[];
    }>;

    export interface IContract {
      allEvents(filter: any, additionalFilter: any, callback: (err, log: IEventLog) => any);
      [ key: string ]: {
        (...args: any[]): void;
        getData(...args): string;
        estimateGas(...args): BigNumber;
      };
    }

    export interface IEventLog<T = any> {
      logIndex: number;
      transactionIndex: number;
      transactionHash: string;
      blockHash: string;
      blockNumber: number;
      address: string;
      type: string;
      event: string;
      args: T;
    }

    export interface IProvider {
      send(payload: any): void;
      sendAsync(payload: any, callback: (err: any, data: any) => any): void;
      isConnected(): boolean;
    }

    export interface ITransaction {
      hash?: string;
      nonce: number;
      blockHash?: string;
      transactionIndex?: number;
      from: string;
      to: string;
      value: BigNumber;
      gasPrice: BigNumber;
      gas: number;
      input?: string;
      data?: string;
    }
  }

  export = Web3;
}
