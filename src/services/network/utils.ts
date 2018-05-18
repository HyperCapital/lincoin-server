import fetch from "node-fetch";
import { IProvider } from "web3";

/**
 * creates web3 provider
 * @param {string} endpoint
 * @returns {module:web3.Web3.IProvider}
 */
export function createWeb3Provider(endpoint: string): IProvider {
  return {
    send: () => {
      throw new Error("sync requests are not supported");
    },
    sendAsync: (payload, callback) => {
      fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => callback(null, data))
        .catch((err) => callback(err, null));
    },
    isConnected: () => true,
  };
}
