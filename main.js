const SHA256 = require('crypto-js/sha256');


class Transaction
{
    constructor(fromAddress,toAddress,amount)
    {
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}
class Block
{
    constructor(timestamp,transactions,previousHash= '')
    {
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }

    calculateHash()
    {
        return SHA256(this.index+this.previousHash+this.timestamp+this.previousHash+JSON.stringify(this.data),this.nonce).toString();
    }

    mineBlock(difficulty)
    {
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0"))
        {
            this.nonce++;
            this.hash=this.calculateHash();
        }

    }
}

class Blockchain{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty=2;
        this.miningReward = 100;
        this.pendingTransactions= [];
    }

    minePendingTransactions(miningRewardAdress)
    {
        let block=new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);

        this.chain.push(block);
        this.pendingTransactions= [];
    }

    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(yourAddress)
    {
        let balance =0;
        for (const block of this.chain)
        {
            for (const trans of block.transactions)
            {
                if (trans.toAddress==yourAddress) balance+=trans.amount;
                if (trans.fromAddress==yourAddress) balance-=trans.amount;
            }
        }
    }

    createGenesisBlock(){
        return new Block("21/06/2022","Genesis Bloc","0");
    }

    addBlock(newBlock)
    {
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    checkChain(){
        for (let i=1;i<this.chain.length;i++)
        {
            const cur=this.chain[i];
            const prev=this.chain[i-1];
            if (cur.previousHash!=prev.hash) return false;
            if (cur.hash!=this.calculateHash()) return false;
        }
        return true
    }
}


let testcoin= new Blockchain();