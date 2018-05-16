"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const http_1 = require("http");
const winston_1 = require("winston");
const ws_1 = require("ws");
const services_1 = require("./services");
const constants_1 = require("./constants");
/**
 * Container
 */
class Container extends inversify_1.Container {
    get logger() {
        return this.get(constants_1.ConstantNames.Logger);
    }
    get httpServer() {
        return this.get(constants_1.ConstantNames.HttpServer);
    }
    get wsServer() {
        return this.get(constants_1.ConstantNames.WsServer);
    }
    constructor(options = {}) {
        super(Object.assign({ defaultScope: "Singleton" }, options));
    }
    /**
     * setup
     * @param {IConfig} config
     */
    setup(config) {
        // constants
        this.bind(constants_1.ConstantNames.Config).toConstantValue(config);
        this.bind(constants_1.ConstantNames.Logger).toConstantValue(new winston_1.Logger(Object.assign({ level: "debug", exitOnError: false, transports: [
                new winston_1.transports.Console(),
            ] }, (config.logger || {}))));
        this.bind(constants_1.ConstantNames.HttpServer).toConstantValue(new http_1.Server(null));
        this.bind(constants_1.ConstantNames.WsServer).toConstantValue(new ws_1.Server(Object.assign({ clientTracking: false, maxPayload: 1024, path: "/", server: this.httpServer }, (config.wsServer || {}))));
        // services
        this.bind(constants_1.ServiceNames.Apn).to(services_1.Apn);
        this.bind(constants_1.ServiceNames.ConnectionHandler).to(services_1.ConnectionHandler);
        this.bind(constants_1.ServiceNames.ConnectionManager).to(services_1.ConnectionManager);
        this.bind(constants_1.ServiceNames.ContractHandler).to(services_1.ContractHandler);
        this.bind(constants_1.ServiceNames.NetworkManager).to(services_1.NetworkManager);
        this.bind(constants_1.ServiceNames.RequestHandler).to(services_1.RequestHandler);
        this.bind(constants_1.ServiceNames.SessionManager).to(services_1.SessionManager);
    }
    /**
     * binds name to service
     * @param {string} name
     * @param {{new(...args: any[]): any}} Service
     * @returns {this}
     */
    bindToService(name, Service) {
        this.bind(name).to(Service);
        return this;
    }
    /**
     * binds name to constant
     * @param {string} name
     * @param value
     * @returns {this}
     */
    bindToConstant(name, value) {
        this.bind(name).toConstantValue(value);
        return this;
    }
    /**
     * sets connection controllers
     * @param {{new(...args: any[]): any}} Controllers
     * @returns {this}
     */
    setConnectionControllers(...Controllers) {
        for (const Controller of Controllers) {
            this.bind(constants_1.ServiceNames.ConnectionController).to(Controller);
        }
        return this.use(constants_1.ServiceNames.ConnectionHandler);
    }
    /**
     * sets contract controllers
     * @param {{new(...args: any[]): any}} Controllers
     * @returns {this}
     */
    setContractControllers(...Controllers) {
        for (const Controller of Controllers) {
            this.bind(constants_1.ServiceNames.ContractController).to(Controller);
        }
        return this.use(constants_1.ServiceNames.ContractHandler);
    }
    /**
     * sets request controllers
     * @param {{new(...args: any[]): any}} Controllers
     * @returns {this}
     */
    setRequestControllers(...Controllers) {
        for (const Controller of Controllers) {
            this.bind(constants_1.ServiceNames.RequestController).to(Controller);
        }
        return this.use(constants_1.ServiceNames.RequestHandler);
    }
    use(name) {
        if (this.isBound(name)) {
            this.get(name);
        }
        return this;
    }
}
exports.Container = Container;
