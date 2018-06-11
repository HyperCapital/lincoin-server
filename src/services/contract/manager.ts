import { injectable, inject } from "inversify";
import { LoggerInstance } from "winston";
import { ConstantNames, ServiceNames, DEFAULT_ID } from "../../constants";
import { IConfig } from "../../config";
import { INetworkManager } from "../network";
import { IContract } from "./interfaces";
import abis from "./abis";

export interface IContractManager {
  get(network: number, id: string): IContract;
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
    @inject(ServiceNames.NetworkManager) networkManager: INetworkManager,
  ) {

    if (config.contracts) {
      for (const options of config.contracts) {
        const { id, type, addresses } = options;
        let { abi } = options;

        if (!abi && type) {
          abi = abis[ type ] || null;
        }

        if (abi) {
          for (const { network, address } of addresses) {
            const web3 = networkManager.getWeb3(network);
            if (web3) {
              const key = `${network}_${id || DEFAULT_ID}`;
              const web3Contract: any = web3.eth.contract(abi).at(address);
              const contract: IContract = {
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

              this.contracts.set(key, contract);
            }
          }
        }
      }
    }
  }

  /**
   * gets contract
   * @param {number} network
   * @param {string} id
   * @returns {IContract}
   */
  public get(network: number, id: string): IContract {
    const key = `${network}_${id || DEFAULT_ID}`;
    return this.contracts.get(key) || null;
  }
}
