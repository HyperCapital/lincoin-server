/// <reference types="winston" />
/// <reference types="node" />
/// <reference types="ws" />
import { Container as BaseContainer, interfaces } from "inversify";
import { Server as HttpServer } from "http";
import { LoggerInstance } from "winston";
import { Server as WsServer } from "ws";
import { IConfig } from "./config";
import { IConnectionController, IContractController, IRequestController } from "./services";
export interface IContainer extends interfaces.Container {
    logger: LoggerInstance;
    httpServer: HttpServer;
    wsServer: WsServer;
    bindToService(id: string, Service: {
        new (...args: any[]): any;
    }): IContainer;
    bindToConstant(id: string, value: any): IContainer;
    setConnectionControllers(...Controllers: Array<{
        new (): IConnectionController;
    }>): IContainer;
    setContractControllers(...Controllers: Array<{
        new (): IContractController;
    }>): IContainer;
    setRequestControllers(...Controllers: Array<{
        new (): IRequestController;
    }>): IContainer;
}
/**
 * Container
 */
export declare class Container extends BaseContainer implements IContainer {
    readonly logger: LoggerInstance;
    readonly httpServer: HttpServer;
    readonly wsServer: WsServer;
    constructor(config: IConfig);
    /**
     * binds name to service
     * @param {string} name
     * @param {{new(...args: any[]): any}} Service
     * @returns {this}
     */
    bindToService(name: string, Service: {
        new (...args: any[]): any;
    }): this;
    /**
     * binds name to constant
     * @param {string} name
     * @param value
     * @returns {this}
     */
    bindToConstant(name: string, value: any): this;
    /**
     * sets connection controllers
     * @param {{new(...args: any[]): any}} Controllers
     * @returns {this}
     */
    setConnectionControllers(...Controllers: Array<{
        new (...args: any[]): any;
    }>): this;
    /**
     * sets contract controllers
     * @param {{new(...args: any[]): any}} Controllers
     * @returns {this}
     */
    setContractControllers(...Controllers: Array<{
        new (...args: any[]): any;
    }>): this;
    /**
     * sets request controllers
     * @param {{new(...args: any[]): any}} Controllers
     * @returns {this}
     */
    setRequestControllers(...Controllers: Array<{
        new (...args: any[]): any;
    }>): this;
    private use(name);
}
