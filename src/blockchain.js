
const { Block } = require("./block")
const { Transaction } = require("./transaction")

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.parse('2021-01-01'), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    addTransaction(transaction) {

        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must include from and to address");
        }

        if(!transaction.isValid()) {
            throw new Error("Cannot add invalid transaction to the chain");
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for(const block of this.chain) {
            for (const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()) {
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== prevBlock.hash) {
                return false;
            }
        }

        return true;
    }

    getAllTransactionsForWallet(address) {
        const txs = [];
    
        for (const block of this.chain) {
          for (const tx of block.transactions) {
            if (tx.fromAddress === address || tx.toAddress === address) {
              txs.push(tx);
            }
          }
        }
    
        return txs;
      }
}

module.exports.Blockchain = Blockchain;