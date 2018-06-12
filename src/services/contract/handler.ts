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
        const { handler } = options;
        const id = options.id || DEFAULT_ID;

        const contract = contractManager.get(id);

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
                }, err);
                return;
              }

              this
                .eventHandler(id, log)
                .catch((err) => {
                  logger.error("contract.eventHandler", {
                    id,
                  }, err);
                });
            },
          );
        }
      }
    }
  }

  private async eventHandler(contract: string, log: Web3.IEventLog): Promise<void> {
    if (this.eventHandlers[ contract ]) {
      const { event } = log;

      for (const { type, handler } of this.eventHandlers[ contract ]) {
        if (type === event) {
          const promise: any = handler(log);
          if (promise instanceof Promise) {
            await promise;
          }
        }
      }
    }
  }
}
