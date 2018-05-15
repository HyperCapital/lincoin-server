/// <reference types="node" />
/**
 * prepares hex
 * @param {string} hex
 * @param {boolean} add0x
 * @returns {string}
 */
export declare function prepareHex(hex: string, add0x?: boolean): string;
/**
 * converts hex to buffer
 * @param {string} hex
 * @returns {Buffer}
 */
export declare function hexToBuffer(hex: string): Buffer;
/**
 * converts buffer to hex
 * @param {Buffer} buffer
 * @param {boolean} add0x
 * @returns {string}
 */
export declare function bufferToHex(buffer: Buffer, add0x?: boolean): string;
