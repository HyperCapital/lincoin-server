"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secp256k1_1 = require("secp256k1");
const buffer_1 = require("./buffer");
const crypto_1 = require("./crypto");
/**
 * converts public key to address
 * @param {Buffer} publicKey
 * @returns {string}
 */
function publicKeyToAddress(publicKey) {
    return buffer_1.bufferToHex(crypto_1.sha3(publicKey.slice(1)).slice(-20), true);
}
exports.publicKeyToAddress = publicKeyToAddress;
/**
 * recovers address
 * @param {Buffer} message
 * @param {Buffer} signature
 * @param {number} recovery
 * @returns {string}
 */
function recoverAddress(message, signature, recovery) {
    const publicKey = secp256k1_1.recover(message, signature, recovery, false);
    return publicKeyToAddress(publicKey);
}
exports.recoverAddress = recoverAddress;
