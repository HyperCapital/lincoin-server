import { injectable, inject } from "inversify";
import { LoggerInstance } from "winston";
import { ConstantNames, ServiceNames, DEFAULT_ID } from "../../constants";
import { IConfig } from "../../config";
import { INetwork } from "../network";
import { IContractModel, ContractModel } from "./model";
import abis from "./abis";

export interface IContractManager {
  get(id?: string): IContractModel;
}

/**
 * Contract handler service
 */
@injectable()
export class ContractManager implements IContractManager {
  private contracts = new Map<string, IContractModel>();

  constructor(
    @inject(ConstantNames.Config) config: IConfig,
    @inject(ConstantNames.Logger) logger: LoggerInstance,
    @inject(ServiceNames.Network) network: INetwork,
  ) {

    if (config.contracts) {
      for (const options of config.contracts) {
        const { type, address } = options;
        let { abi } = options;
        const id = options.id || DEFAULT_ID;

        if (!abi && type) {
          abi = abis[ type ] || null;
        }

        if (abi && network.web3) {
          this.contracts.set(id, new ContractModel(network, address, abi));
        }
      }
    }
  }

  /**
   * gets contract
   * @param {string} id
   * @returns {IContractModel}
   */
  public get(id?: string): IContractModel {
    return this.contracts.get(id || DEFAULT_ID) || null;
  }
}
