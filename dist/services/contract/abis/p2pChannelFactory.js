"use strict";
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "uid",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "addr",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "state",
                "type": "bytes"
            },
            {
                "indexed": false,
                "name": "deposit",
                "type": "uint256"
            }
        ],
        "name": "Opened",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "uid",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "addr",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "state",
                "type": "bytes"
            }
        ],
        "name": "Joined",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "uid",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "addr",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "state",
                "type": "bytes"
            }
        ],
        "name": "Closed",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "uid",
                "type": "bytes32"
            },
            {
                "name": "state",
                "type": "bytes"
            },
            {
                "name": "stateV",
                "type": "uint8"
            },
            {
                "name": "stateR",
                "type": "bytes32"
            },
            {
                "name": "stateS",
                "type": "bytes32"
            }
        ],
        "name": "open",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "uid",
                "type": "bytes32"
            },
            {
                "name": "state",
                "type": "bytes"
            },
            {
                "name": "stateV",
                "type": "uint8"
            },
            {
                "name": "stateR",
                "type": "bytes32"
            },
            {
                "name": "stateS",
                "type": "bytes32"
            }
        ],
        "name": "join",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "uid",
                "type": "bytes32"
            },
            {
                "name": "prevState",
                "type": "bytes"
            },
            {
                "name": "prevStateV",
                "type": "uint8"
            },
            {
                "name": "prevStateR",
                "type": "bytes32"
            },
            {
                "name": "prevStateS",
                "type": "bytes32"
            },
            {
                "name": "state",
                "type": "bytes"
            }
        ],
        "name": "close",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
