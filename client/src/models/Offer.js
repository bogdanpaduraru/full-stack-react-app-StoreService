class Transaction {
    constructor(itemId, itemName, itemDelta) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemDelta = itemDelta;
    }
}

module.exports = Transaction;