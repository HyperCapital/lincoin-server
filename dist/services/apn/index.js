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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const apn_1 = require("apn");
const constants_1 = require("../../constants");
/**
 * Apn service
 */
let Apn = class Apn {
    constructor({ apn }) {
        this.providers = new Map();
        if (!apn) {
            return;
        }
        if (apn.provider) {
            this.providers.set(constants_1.DEFAULT_ID, new apn_1.Provider(apn.provider));
        }
        if (apn.providers) {
            for (let _a of apn.providers) {
                const { id } = _a, options = __rest(_a, ["id"]);
                this.providers.set(id || constants_1.DEFAULT_ID, new apn_1.Provider(options));
            }
        }
    }
    sendTo(recipients, note, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!provider) {
                provider = constants_1.DEFAULT_ID;
            }
            if (!this.providers.has(provider)) {
                throw new Error(`Apn Provider ${provider} not found`);
            }
            return this.providers.get(provider).send(note, recipients);
        });
    }
};
Apn = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(constants_1.ConstantNames.Config)),
    __metadata("design:paramtypes", [Object])
], Apn);
exports.Apn = Apn;
