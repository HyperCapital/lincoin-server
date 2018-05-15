import { bufferToHex } from "./buffer";
import { sha3 } from "./crypto";

/**
 * converts public key to address
 * @param {Buffer} publicKey
 * @returns {string}
 */
export function publicKeyToAddress(publicKey: Buffer): string {
  return bufferToHex(
    sha3(publicKey.slice(1)).slice(-20),
    true,
  );
}
