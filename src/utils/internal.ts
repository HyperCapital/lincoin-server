/**
 * creates sleep promise
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
