import { injectable, inject, multiInject, optional } from "inversify";
import * as Web3 from "web3";
import { LoggerInstance } from "winston";
import { ConstantNames, ServiceNames } from "../../constants";
import { IConfig } from "../../config";
import { INetworkManager } from "../network";
import { IContractController, IContractEventHandler } from "./interfaces";
import abis from "./abis";

/**
 * Contract handler service
 */
@injectable()
export class ContractHandler {
  private eventHandlers: { [ key: string ]: IContractEventHandler[] } = {};

  constructor(
    @inject(ConstantNames.Config) config: IConfig,
    @inject(ConstantNames.Logger) logger: LoggerInstance,
    @inject(ServiceNames.NetworkManager) networkManager: INetworkManager,
    @multiInject(ServiceNames.ContractController) @optional() controllers: IContractController[],
  ) {
    for (const { contract, eventHandlers } of controllers) {
      const id = contract || "default";
      this.eventHandlers[ id ] = [
        ...(this.eventHandlers[ id ] || []),
        ...eventHandlers,
      ];
    }

    if (config.contracts) {
      for (const options of config.contracts) {
        let { id, abi } = options;
        const { type, addresses, filter, additionalFilter } = options;

        if (!id) {
          id = "default";
        }

        if (!abi && type) {
          abi = abis[ type ] || null;
        }

        if (abi) {
          for (const { network, address } of addresses) {
            const web3 = networkManager.getWeb3(network);
            if (web3) {
              const contract: any = web3.eth.contract(abi).at(address);

              contract.allEvents(
                filter || null,
                additionalFilter || {
                  fromBlock: "latest",
                },
                (err, log) => {
                  if (err) {
                    logger.error("contract.event", {
                      id,
                      network,
                    }, err);
                    return;
                  }

                  this
                    .eventHandler(id, network, log)
                    .catch((err) => {
                      logger.error("contract.eventHandler", {
                        id,
                        network,
                      }, err);
                    });
                },
              );
            }
          }
        }
      }
    }
  }

  private async eventHandler(contract: string, network: number, log: Web3.IEventLog): Promise<void> {
    if (this.eventHandlers[ contract ]) {
      const { event } = log;

      for (const { type, handler } of this.eventHandlers[ contract ]) {
        if (type === event) {
          const promise: any = handler(network, log);
          if (promise instanceof Promise) {
            await promise;
          }
        }
      }
    }
  }
}
