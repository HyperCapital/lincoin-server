import { IConnection } from "../connection";

export interface ISession {
  conn: IConnection;
  hash: Buffer;
  address?: string;
  publicKey?: Buffer;
}
