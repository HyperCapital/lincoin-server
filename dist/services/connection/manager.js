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
/**
 * Connection manager service
 */
let ConnectionManager = class ConnectionManager {
    constructor(config) {
        this.stats = {
            total: 0,
        };
        this.index = 0;
        this.connections = new Map();
        const heartbeatInterval = (config.connection && config.connection.heartbeatInterval) || 15000;
        setInterval(this.heartbeatHandler.bind(this), heartbeatInterval);
    }
    /**
     * creates connection
     * @param {WebSocket} socket
     * @returns {number}
     */
    create(socket) {
        ++this.stats.total;
        const id = ++this.index;
        const connection = {
            id,
            socket,
            isAlive: true,
        };
        socket.on("pong", this.pongHandler.bind(connection));
        this.connections.set(id, connection);
        return id;
    }
    /**
     * terminates connection
     * @param {number} connId
     */
    terminate(connId) {
        if (!this.exists(connId)) {
            return;
        }
        --this.stats.total;
        this.connections
            .get(connId)
            .socket
            .terminate();
        this.connections
            .delete(connId);
    }
    /**
     * checks if connection exists
     * @param {number} connId
     * @returns {boolean}
     */
    exists(connId) {
        return this.connections.has(connId);
    }
    /**
     * send message to connection
     * @param {number} connId
     * @param {number} type
     * @param {Buffer} payload
     * @returns {Promise<void>}
     */
    sendMessage(connId, type, payload = Buffer.alloc(0)) {
        return new Promise((resolve, reject) => {
            if (!this.exists(connId)) {
                reject(new Error(`Connection ${connId} not found`));
                return;
            }
            const data = Buffer.concat([
                Buffer.from([type]),
                payload,
            ]);
            this.connections
                .get(connId)
                .socket
                .send(data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    heartbeatHandler() {
        this.connections.forEach((connection) => {
            const { socket, isAlive } = connection;
            if (!isAlive) {
                socket.close(1000);
                return;
            }
            try {
                socket.ping();
            }
            catch (err) {
                //
            }
            connection.isAlive = false;
        });
    }
    pongHandler() {
        this.isAlive = true;
    }
};
ConnectionManager = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(constants_1.ConstantNames.Config)),
    __metadata("design:paramtypes", [Object])
], ConnectionManager);
exports.ConnectionManager = ConnectionManager;
