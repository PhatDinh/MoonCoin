const SHA256 = require('crypto-js/sha256');

class Block
{
    constructor(index,timestamp,data,previousHash= '')
    {
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
    }

    calculateHash()
    {
        return SHA256(this.index+this.previousHash+this.timestamp+this.previousHash+JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0,"21/06/2022","Genesis Bloc","0");
    }

    addBlock(newBlock)
    {
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.hash=newBlock.calculateHash();
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
        return true;
    }
}


let testcoin= new Blockchain();
testcoin.addBlock(new Block(1,"21/06/2022",{amount:4}));
testcoin.addBlock(new Block(2,"21/06/2022",{amount:5}));
testcoin.addBlock(new Block(3,"21/06/2022",{amount:6}));
testcoin.addBlock(new Block(4,"21/06/2022",{amount:2}));

console.log(JSON.stringify(testcoin,null,4));