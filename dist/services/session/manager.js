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
const secp256k1_1 = require("secp256k1");
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
        this.connIdSessionMap = new Map();
        this.hashSessionMap = new Map();
        this.addressSessionsMap = new Map();
    }
    /**
     * creates session
     * @param {IConnection} conn
     * @returns {ISession}
     */
    create(conn) {
        const { id } = conn;
        const hash = crypto_1.randomBytes(32);
        const result = {
            conn,
            hash,
        };
        this.connIdSessionMap.set(id, result);
        this.hashSessionMap.set(utils_1.bufferToHex(hash), result);
        ++this.stats.total;
        return result;
    }
    /**
     * destroys session
     * @param {IConnection} conn
     */
    destroy({ id }) {
        if (!this.connIdSessionMap.has(id)) {
            return;
        }
        const { hash, address, } = this.connIdSessionMap.get(id);
        this.hashSessionMap.delete(utils_1.bufferToHex(hash));
        if (address && this.removeConnectionAddress(id, address)) {
            --this.stats.verified;
        }
        this.connIdSessionMap.delete(id);
        --this.stats.total;
    }
    /**
     * verifies session
     * @param {IConnection} conn
     * @param {Buffer} signature
     * @param {number} recovery
     * @returns {ISession}
     */
    verify({ id }, signature, recovery) {
        let result = this.connIdSessionMap.get(id) || null;
        if (result) {
            try {
                const publicKey = secp256k1_1.recover(result.hash, signature, recovery, false);
                const address = utils_1.publicKeyToAddress(publicKey);
                if (!result.address ||
                    result.address !== address) {
                    if (result.address && this.removeConnectionAddress(id, result.address)) {
                        --this.stats.verified;
                    }
                    result.address = address;
                    result.publicKey = publicKey;
                    this.addressSessionsMap.set(address, [
                        ...this.addressSessionsMap.get(address) || [],
                        result,
                    ]);
                    ++this.stats.verified;
                }
            }
            catch (e) {
                result = null;
            }
        }
        return result;
    }
    unverify({ id }) {
        const session = this.connIdSessionMap.get(id) || null;
        if (session &&
            session.address &&
            this.removeConnectionAddress(id, session.address)) {
            session.address = null;
            session.publicKey = null;
            --this.stats.verified;
        }
    }
    /**
     * gets connection session
     * @param {IConnection} conn
     * @returns {string}
     */
    getConnectionSession({ id }) {
        return this.connIdSessionMap.get(id) || null;
    }
    /**
     * gets hash session
     * @param {string} hash
     * @returns {ISession}
     */
    getHashSession(hash) {
        return this.hashSessionMap.get(hash) || null;
    }
    /**
     * gets address connections
     * @param {string} address
     * @returns {IConnection[]}
     */
    getAddressConnections(address) {
        return (this.addressSessionsMap.get(address) || []).map(({ conn }) => conn);
    }
    /**
     * gets all addresses connections
     * @param {string[]} exceptAddresses
     * @returns {IConnection[]}
     */
    getAllAddressesConnections(exceptAddresses) {
        let result = [];
        this.addressSessionsMap.forEach((sessions, address) => {
            if (!exceptAddresses || exceptAddresses.indexOf(address) === -1) {
                result = [
                    ...result,
                    ...sessions.map(({ conn }) => conn),
                ];
            }
        });
        return result;
    }
    removeConnectionAddress(connId, address) {
        let result = false;
        let addressSessions = this.addressSessionsMap.get(address) || [];
        if (addressSessions.length) {
            addressSessions = addressSessions.filter(({ conn }) => conn.id !== connId);
            if (addressSessions.length) {
                this.addressSessionsMap.set(address, addressSessions);
            }
            else {
                this.addressSessionsMap.delete(address);
            }
            result = true;
        }
        return result;
    }
};
SessionManager = __decorate([
    inversify_1.injectable()
], SessionManager);
exports.SessionManager = SessionManager;
