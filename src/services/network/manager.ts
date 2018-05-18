import { injectable, inject } from "inversify";
import * as Web3 from "web3";
import { ConstantNames } from "../../constants";
import { IConfig } from "../../config";
import { createWeb3Provider } from "./utils";

export interface INetworkManager {
  getWeb3(id: number): Web3.IWeb3;
}

/**
 * Network manager service
 */
@injectable()
export class NetworkManager implements INetworkManager {

  private web3Instances = new Map<number, Web3.IWeb3>();

  constructor(@inject(ConstantNames.Config) config: IConfig) {
    const networks = config.networks || [];
    for (const { id, endpoint } of networks) {
      this.web3Instances.set(id, new Web3(createWeb3Provider(endpoint)));
    }
  }

  /**
   * gets network web3 instance
   * @param {number} id
   * @returns {module:web3.Web3.IWeb3}
   */
  public getWeb3(id: number): Web3.IWeb3 {
    return this.web3Instances.get(id) || null;
  }
}
