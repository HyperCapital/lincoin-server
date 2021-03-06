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
const inversify_1 = require("inversify");
const constants_1 = require("../../constants");
/**
 * Contract handler service
 */
let ContractHandler = class ContractHandler {
    constructor(config, logger, contractManager, controllers) {
        this.eventHandlers = {};
        for (const { contract, eventHandlers } of controllers) {
            const id = contract || constants_1.DEFAULT_ID;
            this.eventHandlers[id] = [
                ...(this.eventHandlers[id] || []),
                ...eventHandlers,
            ];
        }
        if (config.contracts) {
            for (const options of config.contracts) {
                const { handler } = options;
                const id = options.id || constants_1.DEFAULT_ID;
                const contract = contractManager.get(id);
                if (contract) {
                    contract.watch(handler && handler.filter, handler && handler.additionalFilter, (err, log) => {
                        if (err) {
                            logger.error("contract.event", {
                                id,
                            }, err);
                            return;
                        }
                        this
                            .eventHandler(id, log)
                            .catch((err) => {
                            logger.error("contract.eventHandler", {
                                id,
                            }, err);
                        });
                    });
                }
            }
        }
    }
    eventHandler(contract, log) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.eventHandlers[contract]) {
                const { event } = log;
                for (const { type, handler } of this.eventHandlers[contract]) {
                    if (type === event) {
                        const promise = handler(log);
                        if (promise instanceof Promise) {
                            yield promise;
                        }
                    }
                }
            }
        });
    }
};
ContractHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(constants_1.ConstantNames.Config)),
    __param(1, inversify_1.inject(constants_1.ConstantNames.Logger)),
    __param(2, inversify_1.inject(constants_1.ServiceNames.ContractManager)),
    __param(3, inversify_1.multiInject(constants_1.ServiceNames.ContractController)), __param(3, inversify_1.optional()),
    __metadata("design:paramtypes", [Object, Object, Object, Array])
], ContractHandler);
exports.ContractHandler = ContractHandler;
