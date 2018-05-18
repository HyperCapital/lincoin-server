import { injectable } from "inversify";
import * as WebSocket from "ws";
import { IConnection } from "./interfaces";

export interface IConnectionManager {
  stats: {
    total: number;
  };
  create(socket: WebSocket): IConnection;
  terminate(conn: Partial<IConnection>): void;
  exists(conn: Partial<IConnection>): boolean;
  sendMessage(conn: Partial<IConnection>, type: number, payload?: any): Promise<boolean>;
}

/**
 * Connection manager service
 */
@injectable()
export class ConnectionManager implements IConnectionManager {
  public stats = {
    total: 0,
    muted: 0,
  };

  protected index = 0;
  protected connections = new Map<number, IConnection>();

  /**
   * creates connection
   * @param {WebSocket} socket
   * @returns {IConnection}
   */
  public create(socket: WebSocket): IConnection {
    ++this.stats.total;

    const id = ++this.index;
    const result: IConnection = {
      id,
      socket,
      muted: false,
    };

    this.connections.set(id, result);

    return result;
  }

  /**
   * terminates connection
   * @param {Partial<IConnection>} conn
   */
  public terminate({ id }: Partial<IConnection>): void {
    if (!this.exists({ id })) {
      return;
    }

    const { socket, muted } = this.connections.get(id);

    socket.terminate();

    this.connections.delete(id);

    --this.stats.total;

    if (muted) {
      --this.stats.muted;
    }
  }

  /**
   * checks if connection exists
   * @param {Partial<IConnection>} conn
   * @returns {boolean}
   */
  public exists({ id }: Partial<IConnection>): boolean {
    return this.connections.has(id);
  }

  /**
   * send message to connection
   * @param {Partial<IConnection>} conn
   * @param {number} type
   * @param {Buffer} payload
   * @returns {Promise<boolean>}
   */
  public sendMessage({ id }: Partial<IConnection>, type: number, payload: Buffer = Buffer.alloc(0)): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.exists({ id })) {
        reject(new Error(`Connection ${id} not found`));
        return;
      }

      const { muted, socket } = this.connections.get(id);

      if (muted) {
        resolve(false);
        return;
      }

      const data = Buffer.concat([
        Buffer.from([ type ]),
        payload,
      ]);

      socket.send(data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
