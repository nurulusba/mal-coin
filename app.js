const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index , timeStamp , data , previoushash= "" ) {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
  
    calculateHash() {
      return SHA256(this.index + this.previoushash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    minBlock(difficulty) {
        while(this.hash.substring(0 , difficulty) !== Array(difficulty + 1).join("0")) {
           this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }  
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
   
    }

    createGenesisBlock() {
        return new Block(0 , 8/5/20 , 'Genesis' , "0" );
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.minBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i=1 ; i < this.chain.length ; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previoushash !== previousBlock.hash) {
                return false;
            }
        }
          return true;
    }
}

let MalCoin = new Blockchain();

console.log('Mining Block 1 ...');
MalCoin.addBlock(new Block(1 , '10/1/2021' , {amount:4}));
console.log('Mining Block 2 ...');
MalCoin.addBlock(new Block(2 , '17/1/2021' , {amount:30}));
console.log(MalCoin);



console.log('Is Blockchaine Valid = > ' +  MalCoin.isChainValid());
MalCoin.chain[1].data = {amount : 100};
MalCoin.chain[1].hash = MalCoin.chain[1].calculateHash();

console.log('Is Blockchaine Valid = > ' +  MalCoin.isChainValid());
console.log(JSON.stringify(MalCoin , null , 4));
