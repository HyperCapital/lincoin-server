"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
/**
 * creates web3 provider
 * @param {string} endpoint
 * @returns {module:web3.Web3.IProvider}
 */
function createWeb3Provider(endpoint) {
    return {
        send: () => {
            throw new Error("sync requests are not supported");
        },
        sendAsync: (payload, callback) => {
            node_fetch_1.default(endpoint, {
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
exports.createWeb3Provider = createWeb3Provider;
