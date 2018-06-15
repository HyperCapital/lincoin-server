"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const constants_1 = require("../../constants");
const model_1 = require("./model");
const abis_1 = require("./abis");
/**
 * Contract handler service
 */
let ContractManager = class ContractManager {
    constructor(config, network) {
        this.network = network;
        this.contracts = new Map();
        if (config.contracts) {
            for (const options of config.contracts) {
                const { type, address } = options;
                let { abi } = options;
                const id = options.id || constants_1.DEFAULT_ID;
                if (!abi && type) {
                    abi = abis_1.default[type] || null;
                }
                if (abi && network.web3) {
                    this.contracts.set(id, this.create(address, abi));
                }
            }
        }
    }
    /**
     * gets contract
     * @param {string} id
     * @returns {IContractModel}
     */
    get(id) {
        return this.contracts.get(id || constants_1.DEFAULT_ID) || null;
    }
    /**
     * creates contract
     * @param {string} address
     * @param {any} abi
     * @returns {IContractModel}
     */
    create(address, abi) {
        return new model_1.ContractModel(this.network, address, abi);
    }
};
ContractManager = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(constants_1.ConstantNames.Config)),
    __param(1, inversify_1.inject(constants_1.ServiceNames.Network)),
    __metadata("design:paramtypes", [Object, Object])
], ContractManager);
exports.ContractManager = ContractManager;
