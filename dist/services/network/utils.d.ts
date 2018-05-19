/// <reference types="web3" />
import { IProvider } from "web3";
/**
 * creates web3 provider
 * @param {string} endpoint
 * @returns {module:web3.Web3.IProvider}
 */
export declare function createWeb3Provider(endpoint: string): IProvider;
