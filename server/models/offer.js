class Transaction {
    constructor(itemId, itemDelta) {
        this.itemId = itemId;
        this.itemDelta = itemDelta;
    }
}

class Offer {
    constructor(offerId, offerName) {
        this.offerId = offerId;
        this.offerName = offerName;
        this.transactions = [];
    }

    addOfferItemTransaction(itemId, itemDelta) {
        console.log(itemId + " " + itemDelta);
        var transaction = new Transaction(itemId, itemDelta);
        this.transactions.push(transaction);
    }
}

module.exports = Transaction;
module.exports = Offer;