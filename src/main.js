const { Blockchain } = require("./blockchain");
const { Transaction } = require("./transaction");

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate("1ad907d8e45ace588f7ce42edcc9e4e4047d7e130061adb67c60c449845d9b5c");
const myWalletAddress = myKey.getPublic("hex");

let kbCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10);
tx1.signTransaction(myKey);
kbCoin.addTransaction(tx1);

console.log("Starting miner");
kbCoin.minePendingTransactions(myWalletAddress);
console.log(kbCoin.getBalanceOfAddress(myWalletAddress));

kbCoin.minePendingTransactions(myWalletAddress);
console.log(kbCoin.getBalanceOfAddress(myWalletAddress));

console.log("Is chain valid?", kbCoin.isChainValid());