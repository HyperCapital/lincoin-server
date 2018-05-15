"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metaKey = Symbol();
function contractController(contract = "") {
    return (constructor) => {
        const target = constructor.prototype;
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.contract = contract;
            }
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
exports.contractController = contractController;
function contractEvent(type) {
    return (target, property) => {
        Reflect.defineMetadata(metaKey, [
            ...(Reflect.getMetadata(metaKey, target) || []), {
                type,
                property,
            },
        ], target);
    };
}
exports.contractEvent = contractEvent;
