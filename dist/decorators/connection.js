"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const metaKey = Symbol();
function connectionController() {
    return (constructor) => {
        const target = constructor.prototype;
        return class extends constructor {
            get eventHandlers() {
                const eventHandlers = Reflect.getMetadata(metaKey, target) || [];
                const self = this;
                return eventHandlers.map((eventHandler) => {
                    const handler = self[eventHandler.property].bind(self);
                    return Object.assign({}, eventHandler, { handler });
                });
            }
        };
    };
}
exports.connectionController = connectionController;
function addEventHandler(target, eventHandler) {
    Reflect.defineMetadata(metaKey, [
        ...(Reflect.getMetadata(metaKey, target) || []),
        eventHandler,
    ], target);
}
function socketOpened() {
    return (target, property) => {
        addEventHandler(target, {
            type: services_1.ConnectionEventHandlerTypes.Opened,
            property,
        });
    };
}
exports.socketOpened = socketOpened;
function socketClosed() {
    return (target, property) => {
        addEventHandler(target, {
            type: services_1.ConnectionEventHandlerTypes.Closed,
            property,
        });
    };
}
exports.socketClosed = socketClosed;
function socketMessage(type) {
    return (target, property) => {
        addEventHandler(target, {
            type: services_1.ConnectionEventHandlerTypes.Message,
            property,
            params: {
                type,
            },
        });
    };
}
exports.socketMessage = socketMessage;
