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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const inversify_1 = require("inversify");
const constants_1 = require("../../constants");
const constants_2 = require("./constants");
/**
 * Connection handler service
 */
let ConnectionHandler = class ConnectionHandler {
    constructor(wsServer, logger, manager, controllers) {
        this.eventHandlers = [];
        try {
            this.eventHandlers = controllers.reduce((previous, controller) => [
                ...previous,
                ...controller.eventHandlers,
            ], []);
        }
        catch (err) {
            this.eventHandlers = [];
            logger.error("connection", err);
        }
        wsServer.on("connection", (socket) => {
            const conn = manager.create(socket);
            this.openedHandler(conn)
                .then(() => logger.debug("connection:opened", conn.id))
                .catch((err) => logger.error("connection:open", err));
            socket.on("close", () => {
                this.closedHandler(conn)
                    .then(() => logger.debug("connection:closed", conn.id))
                    .catch((err) => logger.error("connection:close", err));
                manager.terminate(conn);
            });
            socket.on("message", (data) => {
                this.messageHandler(conn, data)
                    .then(() => logger.debug("connection:message", conn.id, data.toString("hex")))
                    .catch((err) => logger.error("connection:message", err));
            });
        });
    }
    openedHandler(conn) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const eventHandler of this.eventHandlers) {
                if (eventHandler.type === constants_2.ConnectionEventHandlerTypes.Opened) {
                    const promise = eventHandler.handler(conn);
                    if (promise instanceof Promise) {
                        yield promise;
                    }
                }
            }
        });
    }
    closedHandler(conn) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const eventHandler of this.eventHandlers) {
                if (eventHandler.type === constants_2.ConnectionEventHandlerTypes.Closed) {
                    const promise = eventHandler.handler(conn);
                    if (promise instanceof Promise) {
                        yield promise;
                    }
                }
            }
        });
    }
    messageHandler(conn, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payload.length) {
                return;
            }
            const type = payload[0];
            for (const eventHandler of this.eventHandlers) {
                if (eventHandler.type === constants_2.ConnectionEventHandlerTypes.Message &&
                    eventHandler.params.type === type) {
                    const promise = eventHandler.handler(conn, payload.slice(1));
                    if (promise instanceof Promise) {
                        yield promise;
                    }
                }
            }
        });
    }
};
ConnectionHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(constants_1.ConstantNames.WsServer)),
    __param(1, inversify_1.inject(constants_1.ConstantNames.Logger)),
    __param(2, inversify_1.inject(constants_1.ServiceNames.ConnectionManager)),
    __param(3, inversify_1.multiInject(constants_1.ServiceNames.ConnectionController)), __param(3, inversify_1.optional()),
    __metadata("design:paramtypes", [ws_1.Server, Object, Object, Array])
], ConnectionHandler);
exports.ConnectionHandler = ConnectionHandler;
