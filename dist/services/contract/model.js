"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContractModel {
    constructor(network, address, abi) {
        this.address = address;
        this.contract = network.web3.eth.contract(abi).at(address);
    }
    getData(method, ...args) {
        return this.contract[method].getData(...args);
    }
    estimateGas(method, ...args) {
        return this.contract[method].estimateGas(...args);
    }
    call(method, ...args) {
        return new Promise((resolve, reject) => {
            this.contract[method](...args, (err, ...result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    watch(filter, additionalFilter, callback) {
        this.contract.allEvents(filter || null, additionalFilter || {
            fromBlock: "latest",
        }, callback);
    }
}
exports.ContractModel = ContractModel;
