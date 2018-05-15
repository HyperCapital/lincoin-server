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
const node_fetch_1 = require("node-fetch");
const constants_1 = require("../../constants");
/**
 * Network manager service
 */
let NetworkManager = NetworkManager_1 = class NetworkManager {
    constructor(config) {
        this.web3Instances = new Map();
        const networks = config.networks || [];
        for (const { id, endpoint } of networks) {
            this.web3Instances.set(id, new Web3(NetworkManager_1.createWeb3Provider(endpoint)));
        }
    }
    static createWeb3Provider(endpoint) {
        return {
            send: () => {
                throw new Error("sync requests are not supported");
            },
            sendAsync: (payload, callback) => {
                node_fetch_1.default(endpoint, {
                    method: "POST",
                    body: JSON.stringify(payload),
                })
                    .then((res) => res.json())
                    .then((data) => callback(null, data))
                    .catch((err) => callback(err, null));
            },
            isConnected: () => true,
        };
    }
    /**
     * gets network web3 instance
     * @param {number} id
     * @returns {module:web3.Web3.IWeb3}
     */
    getWeb3(id) {
        return this.web3Instances.get(id) || null;
    }
};
NetworkManager = NetworkManager_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(constants_1.ConstantNames.Config)),
    __metadata("design:paramtypes", [Object])
], NetworkManager);
exports.NetworkManager = NetworkManager;
var NetworkManager_1;
