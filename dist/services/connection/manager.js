"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
/**
 * Connection manager service
 */
let ConnectionManager = class ConnectionManager {
    /**
     * Connection manager service
     */
    constructor() {
        this.stats = {
            total: 0,
            muted: 0,
        };
        this.index = 0;
        this.connections = new Map();
    }
    /**
     * creates connection
     * @param {WebSocket} socket
     * @returns {IConnection}
     */
    create(socket) {
        ++this.stats.total;
        const id = ++this.index;
        const result = {
            id,
            socket,
            muted: false,
        };
        this.connections.set(id, result);
        return result;
    }
    /**
     * terminates connection
     * @param {Partial<IConnection>} conn
     */
    terminate({ id }) {
        if (!this.exists({ id })) {
            return;
        }
        const { socket, muted } = this.connections.get(id);
        socket.terminate();
        this.connections.delete(id);
        --this.stats.total;
        if (muted) {
            --this.stats.muted;
        }
    }
    /**
     * checks if connection exists
     * @param {Partial<IConnection>} conn
     * @returns {boolean}
     */
    exists({ id }) {
        return this.connections.has(id);
    }
    /**
     * checks if connection is muted
     * @param {number} id
     * @returns {boolean}
     */
    isMuted({ id }) {
        if (!this.exists({ id })) {
            throw new Error(`Connection ${id} not found`);
        }
        return this.connections.get(id).muted;
    }
    /**
     * toggle muted
     * @param {number} id
     * @param {boolean} muted
     * @returns {boolean}
     */
    toggleMuted({ id, muted }) {
        if (!this.exists({ id })) {
            throw new Error(`Connection ${id} not found`);
        }
        const conn = this.connections.get(id);
        let toggled = false;
        if (typeof muted !== "undefined") {
            if (conn.muted !== muted) {
                toggled = true;
                conn.muted = muted;
            }
        }
        else {
            conn.muted = !conn.muted;
            toggled = true;
        }
        if (toggled) {
            this.stats.muted += (conn.muted) ? 1 : -1;
        }
        return conn.muted;
    }
    /**
     * send message to connection
     * @param {Partial<IConnection>} conn
     * @param {number} type
     * @param {Buffer} payload
     * @returns {Promise<boolean>}
     */
    sendMessage({ id }, type, payload = Buffer.alloc(0)) {
        return new Promise((resolve, reject) => {
            if (!this.exists({ id })) {
                reject(new Error(`Connection ${id} not found`));
                return;
            }
            const { muted, socket } = this.connections.get(id);
            if (muted) {
                resolve(false);
                return;
            }
            const data = Buffer.concat([
                Buffer.from([type]),
                payload,
            ]);
            socket.send(data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
};
ConnectionManager = __decorate([
    inversify_1.injectable()
], ConnectionManager);
exports.ConnectionManager = ConnectionManager;
