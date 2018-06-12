"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContractModel {
    constructor(web3, address, abi) {
        this.web3 = web3;
        this.address = address;
        this.contract = web3.eth.contract(abi).at(address);
    }
    getBalance() {
        return new Promise((resolve, reject) => {
            this.web3.eth.getBalance(this.address, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    getData(method, ...args) {
        return this.contract[method].getData(...args);
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
