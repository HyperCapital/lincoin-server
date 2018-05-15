"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
/**
 * Session manager service
 */
let SessionManager = class SessionManager {
    /**
     * Session manager service
     */
    constructor() {
        this.stats = {
            total: 0,
            verified: 0,
        };
        this.connHashMap = new Map();
        this.connAddressMap = new Map();
        this.addressConnMap = new Map();
        this.hashAddressMap = new Map();
    }
    /**
     * creates session
     * @param {number} connId
     * @returns {Buffer}
     */
    create(connId) {
        const result = crypto_1.randomBytes(32);
        this.connHashMap.set(connId, result);
        ++this.stats.total;
        return result;
    }
    /**
     * destroys session
     * @param {number} connId
     */
    destroy(connId) {
        if (this.connAddressMap.has(connId)) {
            const hash = this.connHashMap.get(connId);
            const address = this.connAddressMap.get(connId);
            this.connAddressMap.delete(connId);
            this.addressConnMap.delete(address);
            this.hashAddressMap.delete(utils_1.bufferToHex(hash));
            --this.stats.verified;
        }
        this.connHashMap.delete(connId);
        --this.stats.total;
    }
    /**
     * verifies session
     * @param {number} connId
     * @param {Buffer} signature
     * @param {number} recovery
     * @returns {boolean}
     */
    verify(connId, signature, recovery) {
        let result = false;
        if (this.connHashMap.has(connId) &&
            !this.connAddressMap.has(connId)) {
            const hash = this.connHashMap.get(connId);
            try {
                const address = utils_1.recoverAddress(hash, signature, recovery);
                if (!this.addressConnMap.has(address)) {
                    this.connAddressMap.set(connId, address);
                    this.addressConnMap.set(address, connId);
                    this.hashAddressMap.set(utils_1.bufferToHex(hash), address);
                    ++this.stats.verified;
                    result = true;
                }
            }
            catch (err) {
                result = false;
            }
        }
        return result;
    }
    /**
     * gets address connection id
     * @param {string} address
     * @returns {number}
     */
    getAddressConnectionId(address) {
        return this.addressConnMap.get(address) || null;
    }
    /**
     * gets hash address
     * @param {string} hash
     * @returns {string}
     */
    getHashAddress(hash) {
        return this.hashAddressMap.get(hash) || null;
    }
    /**
     * gets all connection ids
     * @returns {number[]}
     */
    getAllConnectionIds() {
        return [
            ...this.connAddressMap.keys(),
        ];
    }
};
SessionManager = __decorate([
    inversify_1.injectable()
], SessionManager);
exports.SessionManager = SessionManager;
