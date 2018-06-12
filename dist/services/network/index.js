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
const Web3 = require("web3");
const eth_api_1 = require("eth-api");
const constants_1 = require("../../constants");
const utils_1 = require("./utils");
/**
 * Network service
 */
let Network = class Network extends eth_api_1.Api {
    constructor(config) {
        super(config.network ? config.network.endpoint : null);
        this.web3 = null;
        this.web3 = new Web3(utils_1.createWeb3Provider(this.endpoint));
    }
};
Network = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(constants_1.ConstantNames.Config)),
    __metadata("design:paramtypes", [Object])
], Network);
exports.Network = Network;
