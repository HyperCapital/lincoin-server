import { injectable, inject } from "inversify";
import * as WebSocket from "ws";
import { ConstantNames } from "../../constants";
import { IConfig } from "../../config";
import { IConnection } from "./interfaces";

export interface IConnectionManager {
  stats: {
    total: number;
  };
  create(socket: WebSocket): number;
  terminate(connId: number): void;
  exists(connId: number): boolean;
  sendMessage(connId: number, type: number, payload?: any): Promise<void>;
}

/**
 * Connection manager service
 */
@injectable()
export class ConnectionManager implements IConnectionManager {
  public stats = {
    total: 0,
  };

  protected index = 0;
  protected connections = new Map<number, IConnection>();

  constructor(@inject(ConstantNames.Config) config: IConfig) {
    const heartbeatInterval = (
      config.connection && config.connection.heartbeatInterval
    ) || 15000;

    setInterval(
      this.heartbeatHandler.bind(this),
      heartbeatInterval,
    );
  }

  /**
   * creates connection
   * @param {WebSocket} socket
   * @returns {number}
   */
  public create(socket: WebSocket): number {
    ++this.stats.total;

    const id = ++this.index;
    const connection: IConnection = {
      id,
      socket,
      isAlive: true,
    };

    socket.on("pong", this.pongHandler.bind(connection));

    this.connections.set(id, connection);

    return id;
  }

  /**
   * terminates connection
   * @param {number} connId
   */
  public terminate(connId: number): void {
    if (!this.exists(connId)) {
      return;
    }

    --this.stats.total;

    this.connections
      .get(connId)
      .socket
      .terminate();

    this.connections
      .delete(connId);
  }

  /**
   * checks if connection exists
   * @param {number} connId
   * @returns {boolean}
   */
  public exists(connId: number): boolean {
    return this.connections.has(connId);
  }

  /**
   * send message to connection
   * @param {number} connId
   * @param {number} type
   * @param {Buffer} payload
   * @returns {Promise<void>}
   */
  public sendMessage(connId: number, type: number, payload: Buffer = Buffer.alloc(0)): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.exists(connId)) {
        reject(new Error(`Connection ${connId} not found`));
        return;
      }

      const data = Buffer.concat([
        Buffer.from([ type ]),
        payload,
      ]);

      this.connections
        .get(connId)
        .socket
        .send(data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
    });
  }

  protected heartbeatHandler() {
    this.connections.forEach((connection) => {
      const { socket, isAlive } = connection;
      if (!isAlive) {
        socket.close(1000);
        return;
      }

      try {
        socket.ping();
      } catch (err) {
        //
      }

      connection.isAlive = false;
    });
  }

  protected pongHandler(this: IConnection) {
    this.isAlive = true;
  }
}
