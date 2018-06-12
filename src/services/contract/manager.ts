import { injectable, inject } from "inversify";
import { LoggerInstance } from "winston";
import { ConstantNames, ServiceNames, DEFAULT_ID } from "../../constants";
import { IConfig } from "../../config";
import { INetwork } from "../network";
import { IContract } from "./interfaces";
import abis from "./abis";

export interface IContractManager {
  get(id: string): IContract;
}

/**
 * Contract handler service
 */
@injectable()
export class ContractManager implements IContractManager {
  private contracts = new Map<string, IContract>();

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
          const web3Contract: any = network.web3.eth.contract(abi).at(address);
          const contract: IContract = {
            id,
            web3Contract,
            call: (methodName, ...args) => new Promise<any>((resolve, reject) => {
              web3Contract[ methodName ](...args, (err, ...data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              });
            }),
            getData: (methodName, ...args) => web3Contract[ methodName ].getData(...args),
          };

          this.contracts.set(id, contract);
        }
      }
    }
  }

  /**
   * gets contract
   * @param {string} id
   * @returns {IContract}
   */
  public get(id: string): IContract {
    return this.contracts.get(id || DEFAULT_ID) || null;
  }
}
