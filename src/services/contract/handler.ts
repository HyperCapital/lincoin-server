import { injectable, inject, multiInject, optional } from "inversify";
import * as Web3 from "web3";
import { LoggerInstance } from "winston";
import { ConstantNames, ServiceNames, DEFAULT_ID } from "../../constants";
import { IConfig } from "../../config";
import { IContractController, IContractEventHandler } from "./interfaces";
import { IContractManager } from "./manager";

/**
 * Contract handler service
 */
@injectable()
export class ContractHandler {
  private eventHandlers: { [ key: string ]: IContractEventHandler[] } = {};

  constructor(
    @inject(ConstantNames.Config) config: IConfig,
    @inject(ConstantNames.Logger) logger: LoggerInstance,
    @inject(ServiceNames.ContractManager) contractManager: IContractManager,
    @multiInject(ServiceNames.ContractController) @optional() controllers: IContractController[],
  ) {
    for (const { contract, eventHandlers } of controllers) {
      const id = contract || DEFAULT_ID;
      this.eventHandlers[ id ] = [
        ...(this.eventHandlers[ id ] || []),
        ...eventHandlers,
      ];
    }

    if (config.contracts) {
      for (const options of config.contracts) {
        const { id, addresses, handler } = options;

        for (const { network } of addresses) {
          const contract = contractManager.get(network, id);

          if (contract) {
            const filter = handler && handler.filter;
            const additionalFilter = handler && handler.additionalFilter;

            contract.web3Contract.allEvents(
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
