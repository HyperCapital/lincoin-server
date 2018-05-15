"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * prepares hex
 * @param {string} hex
 * @param {boolean} add0x
 * @returns {string}
 */
function prepareHex(hex, add0x = false) {
    hex = hex.toUpperCase();
    if (hex.startsWith("0X")) {
        hex = hex.slice(2);
    }
    return `${add0x ? "0x" : ""}${hex.toUpperCase()}`;
}
exports.prepareHex = prepareHex;
/**
 * converts hex to buffer
 * @param {string} hex
 * @returns {Buffer}
 */
function hexToBuffer(hex) {
    let result = null;
    try {
        hex.toLowerCase();
        if (hex.startsWith("0x")) {
            hex = hex.slice(2);
        }
        if (hex) {
            result = Buffer.from(hex, "hex");
        }
    }
    catch (err) {
        result = null;
    }
    return result;
}
exports.hexToBuffer = hexToBuffer;
/**
 * converts buffer to hex
 * @param {Buffer} buffer
 * @param {boolean} add0x
 * @returns {string}
 */
function bufferToHex(buffer, add0x = false) {
    let result = null;
    try {
        result = prepareHex(buffer.toString("hex"), add0x);
    }
    catch (err) {
        result = null;
    }
    return result;
}
exports.bufferToHex = bufferToHex;
