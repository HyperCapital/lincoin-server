import { injectable, inject } from "inversify";
import * as Web3 from "web3";
import { Api, IApi } from "eth-api";
import { ConstantNames } from "../../constants";
import { IConfig } from "../../config";
import { createWeb3Provider } from "./utils";

export interface INetwork extends IApi {
  web3: Web3.IWeb3;
}

/**
 * Network service
 */
@injectable()
export class Network extends Api implements INetwork {

  public readonly web3: Web3.IWeb3 = null;

  constructor(@inject(ConstantNames.Config) config: IConfig) {
    super(config.network ? config.network.endpoint : null);
    this.web3 = new Web3(createWeb3Provider(this.endpoint));
  }
}
