/**
 * prepares hex
 * @param {string} hex
 * @param {boolean} add0x
 * @returns {string}
 */
export function prepareHex(hex: string, add0x = false): string {
  hex = hex.toUpperCase()
  if (hex.startsWith("0X")) {
    hex = hex.slice(2);
  }

  return `${add0x ? "0x" : ""}${hex.toUpperCase()}`;
}

/**
 * converts hex to buffer
 * @param {string} hex
 * @returns {Buffer}
 */
export function hexToBuffer(hex: string): Buffer {
  let result: Buffer = null;
  try {
    hex.toLowerCase();
    if (hex.startsWith("0x")) {
      hex = hex.slice(2);
    }
    if (hex) {
      result = Buffer.from(hex, "hex");
    }
  } catch (err) {
    result = null;
  }
  return result;
}

/**
 * converts buffer to hex
 * @param {Buffer} buffer
 * @param {boolean} add0x
 * @returns {string}
 */
export function bufferToHex(buffer: Buffer, add0x = false): string {
  let result: string = null;
  try {
    result = prepareHex(buffer.toString("hex"), add0x);
  } catch (err) {
    result = null;
  }

  return result;
}
