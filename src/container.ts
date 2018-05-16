import { Container as BaseContainer, interfaces } from "inversify";
import { Server as HttpServer } from "http";
import { Logger, LoggerInstance, transports } from "winston";
import { Server as WsServer } from "ws";
import { IConfig } from "./config";
import {
  Apn,
  ConnectionHandler,
  ConnectionManager,
  IConnectionController,
  ContractHandler,
  IContractController,
  NetworkManager,
  RequestHandler,
  IRequestController,
  SessionManager,
} from "./services";
import {
  ConstantNames,
  ServiceNames,
} from "./constants";

export interface IContainer extends interfaces.Container {
  logger: LoggerInstance;
  httpServer: HttpServer;
  wsServer: WsServer;
  setup(config: IConfig): void;
  bindToService(id: string, Service: { new(...args: any[]): any }): IContainer;
  bindToConstant(id: string, value: any): IContainer;
  setConnectionControllers(...Controllers: Array<{ new(): IConnectionController }>): IContainer;
  setContractControllers(...Controllers: Array<{ new(): IContractController }>): IContainer;
  setRequestControllers(...Controllers: Array<{ new(): IRequestController }>): IContainer;
}

/**
 * Container
 */
export class Container extends BaseContainer implements IContainer {

  public get logger(): LoggerInstance {
    return this.get(ConstantNames.Logger);
  }

  public get httpServer(): HttpServer {
    return this.get(ConstantNames.HttpServer);
  }

  public get wsServer(): WsServer {
    return this.get(ConstantNames.WsServer);
  }

  constructor(options: interfaces.ContainerOptions = {}) {
    super({
      defaultScope: "Singleton",
      ...options,
    });
  }

  /**
   * setup
   * @param {IConfig} config
   */
  public setup(config: IConfig): void {
    // constants
    this.bind(ConstantNames.Config).toConstantValue(config);
    this.bind(ConstantNames.Logger).toConstantValue(new Logger({
      level: "debug",
      exitOnError: false,
      transports: [
        new transports.Console(),
      ],
      ...(config.logger || {}),
    }));
    this.bind(ConstantNames.HttpServer).toConstantValue(new HttpServer(null));
    this.bind(ConstantNames.WsServer).toConstantValue(new WsServer({
      clientTracking: false,
      maxPayload: 1024,
      path: "/",
      server: this.httpServer,
      ...(config.wsServer || {}),
    }));

    // services
    this.bind(ServiceNames.Apn).to(Apn);
    this.bind(ServiceNames.ConnectionHandler).to(ConnectionHandler);
    this.bind(ServiceNames.ConnectionManager).to(ConnectionManager);
    this.bind(ServiceNames.ContractHandler).to(ContractHandler);
    this.bind(ServiceNames.NetworkManager).to(NetworkManager);
    this.bind(ServiceNames.RequestHandler).to(RequestHandler);
    this.bind(ServiceNames.SessionManager).to(SessionManager);
  }

  /**
   * binds name to service
   * @param {string} name
   * @param {{new(...args: any[]): any}} Service
   * @returns {this}
   */
  public bindToService(name: string, Service: { new(...args: any[]): any }): this {
    this.bind(name).to(Service);
    return this;
  }

  /**
   * binds name to constant
   * @param {string} name
   * @param value
   * @returns {this}
   */
  public bindToConstant(name: string, value: any): this {
    this.bind(name).toConstantValue(value);
    return this;
  }

  /**
   * sets connection controllers
   * @param {{new(...args: any[]): any}} Controllers
   * @returns {this}
   */
  public setConnectionControllers(...Controllers: Array<{ new(...args: any[]): any }>): this {
    for (const Controller of Controllers) {
      this.bind(ServiceNames.ConnectionController).to(Controller);
    }
    return this.use(ServiceNames.ConnectionHandler);
  }

  /**
   * sets contract controllers
   * @param {{new(...args: any[]): any}} Controllers
   * @returns {this}
   */
  public setContractControllers(...Controllers: Array<{ new(...args: any[]): any }>): this {
    for (const Controller of Controllers) {
      this.bind(ServiceNames.ContractController).to(Controller);
    }
    return this.use(ServiceNames.ContractHandler);
  }

  /**
   * sets request controllers
   * @param {{new(...args: any[]): any}} Controllers
   * @returns {this}
   */
  public setRequestControllers(...Controllers: Array<{ new(...args: any[]): any }>): this {
    for (const Controller of Controllers) {
      this.bind(ServiceNames.RequestController).to(Controller);
    }
    return this.use(ServiceNames.RequestHandler);
  }

  private use(name: string): this {
    if (this.isBound(name)) {
      this.get(name);
    }
    return this;
  }
}
