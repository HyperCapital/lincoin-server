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
        this.connIdHashMap = new Map();
        this.connIdAddressMap = new Map();
        this.addressConnIdsMap = new Map();
        this.hashAddressMap = new Map();
    }
    /**
     * creates session
     * @param {IConnection} conn
     * @returns {Buffer}
     */
    create({ id }) {
        const result = crypto_1.randomBytes(32);
        this.connIdHashMap.set(id, result);
        ++this.stats.total;
        return result;
    }
    /**
     * destroys session
     * @param {IConnection} conn
     */
    destroy({ id }) {
        if (this.connIdAddressMap.has(id)) {
            const hash = this.connIdHashMap.get(id);
            const address = this.connIdAddressMap.get(id);
            this.connIdAddressMap.delete(id);
            const addressConnIds = this.addressConnIdsMap
                .get(address)
                .filter((item) => item !== id);
            if (addressConnIds.length) {
                this.addressConnIdsMap.set(address, addressConnIds);
            }
            else {
                this.addressConnIdsMap.delete(address);
            }
            this.hashAddressMap.delete(utils_1.bufferToHex(hash));
            --this.stats.verified;
        }
        this.connIdHashMap.delete(id);
        --this.stats.total;
    }
    /**
     * verifies session
     * @param {IConnection} conn
     * @param {Buffer} signature
     * @param {number} recovery
     * @returns {string}
     */
    verify({ id }, signature, recovery) {
        let result = null;
        if (this.connIdHashMap.has(id) &&
            !this.connIdAddressMap.has(id)) {
            const hash = this.connIdHashMap.get(id);
            try {
                const address = utils_1.recoverAddress(hash, signature, recovery);
                const addressConnIds = this.addressConnIdsMap.get(address) || [];
                if (addressConnIds.indexOf(id) === -1) {
                    addressConnIds.push(id);
                    this.connIdAddressMap.set(id, address);
                    this.addressConnIdsMap.set(address, addressConnIds);
                    this.hashAddressMap.set(utils_1.bufferToHex(hash), address);
                    ++this.stats.verified;
                    result = address;
                }
            }
            catch (err) {
                result = null;
            }
        }
        return result;
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
     * gets address connection id
     * @param {string} address
     * @returns {Array<Partial<IConnection>>}
     */
    getAddressConnections(address) {
        return (this.addressConnIdsMap.get(address) || []).map((id) => ({
            id,
        }));
    }
    /**
     * gets all connection ids
     * @returns {Array<Partial<IConnection>>}
     */
    getAllConnections() {
        return [
            ...this.connIdAddressMap.keys(),
        ].map((id) => ({
            id,
        }));
    }
};
SessionManager = __decorate([
    inversify_1.injectable()
], SessionManager);
exports.SessionManager = SessionManager;
