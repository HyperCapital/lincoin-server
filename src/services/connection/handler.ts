import { Server } from "ws";
import { injectable, inject, multiInject, optional } from "inversify";
import { LoggerInstance } from "winston";
import { ConstantNames, ServiceNames } from "../../constants";
import { IConnectionManager } from "./manager";
import { IConnection, IConnectionController, IConnectionEventHandler } from "./interfaces";
import { ConnectionEventHandlerTypes } from "./constants";

/**
 * Connection handler service
 */
@injectable()
export class ConnectionHandler {
  protected readonly eventHandlers: IConnectionEventHandler[] = [];

  constructor(
    @inject(ConstantNames.WsServer) wsServer: Server,
    @inject(ConstantNames.Logger) logger: LoggerInstance,
    @inject(ServiceNames.ConnectionManager) manager: IConnectionManager,
    @multiInject(ServiceNames.ConnectionController) @optional() controllers: IConnectionController[],
  ) {

    try {
      this.eventHandlers = controllers.reduce((previous, controller) => [
        ...previous,
        ...controller.eventHandlers,
      ], []);
    } catch (err) {
      this.eventHandlers = [];
      logger.error("connection", err);
    }

    wsServer.on("connection", (socket) => {
      const conn = manager.create(socket);

      this.openedHandler(conn)
        .then(() => logger.debug("connection:opened", conn.id))
        .catch((err) => logger.error("connection:open", err));

      socket.on("close", () => {
        this.closedHandler(conn)
          .then(() => logger.debug("connection:closed", conn.id))
          .catch((err) => logger.error("connection:close", err));

        manager.terminate(conn);
      });

      socket.on("message", (data: Buffer) => {
        this.messageHandler(conn, data)
          .then(() => logger.debug("connection:message", conn.id, data.toString("hex")))
          .catch((err) => logger.error("connection:message", err));
      });
    });
  }

  private async openedHandler(conn: IConnection): Promise<void> {
    for (const eventHandler of this.eventHandlers) {
      if (eventHandler.type === ConnectionEventHandlerTypes.Opened) {
        const promise: any = eventHandler.handler(conn);

        if (promise instanceof Promise) {
          await promise;
        }
      }
    }
  }

  private async closedHandler(conn: IConnection): Promise<void> {
    for (const eventHandler of this.eventHandlers) {
      if (eventHandler.type === ConnectionEventHandlerTypes.Closed) {
        const promise: any = eventHandler.handler(conn);

        if (promise instanceof Promise) {
          await promise;
        }
      }
    }
  }

  private async messageHandler(conn: IConnection, payload: Buffer): Promise<void> {
    if (!payload.length) {
      return;
    }

    const type = payload[ 0 ];

    for (const eventHandler of this.eventHandlers) {
      if (
        eventHandler.type === ConnectionEventHandlerTypes.Message &&
        eventHandler.params.type === type
      ) {
        const promise: any = eventHandler.handler(conn, payload.slice(1));

        if (promise instanceof Promise) {
          await promise;
        }
      }
    }
  }
}
