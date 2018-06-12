import { injectable, inject } from "inversify";
import * as Web3 from "web3";
import { ConstantNames } from "../../constants";
import { IConfig } from "../../config";
import { createWeb3Provider } from "./utils";

export interface INetwork {
  web3: Web3.IWeb3;
}

/**
 * Network service
 */
@injectable()
export class Network implements INetwork {

  public readonly web3: Web3.IWeb3 = null;

  constructor(@inject(ConstantNames.Config) config: IConfig) {
    if (config.network) {
      const { endpoint } = config.network;
      this.web3 = new Web3(createWeb3Provider(endpoint));
    }
  }
}
