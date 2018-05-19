import { Container as BaseContainer, interfaces } from "inversify";
import { IConfig } from "./config";
import { IConnectionController, IContractController, IRequestController } from "./services";
export interface IContainer extends interfaces.Container {
    setup(config?: IConfig): IContainer;
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
    start(): void;
}
/**
 * Container
 */
export declare class Container extends BaseContainer implements IContainer {
    constructor(options?: interfaces.ContainerOptions);
    /**
     * setup
     * @param {IConfig} config
     * @returns {this}
     */
    setup(config?: IConfig): this;
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
    /**
     * starts
     */
    start(): void;
    private use(name);
}
