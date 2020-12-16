var express = require('express');
var Offers = require('../models/offers');
var Offer = require('../models/offer');
const { json } = require('body-parser');

var router = express.Router();

router.get('/', function (req, res) {
    Offers.retrieveAll(function (err, dbOffers) {
        if (err.error){
            console.log('exiting from error branch');
            return res.json(err);
        }

        var offers  = [];

        for(const dbOffer of dbOffers) {
            Offers.retrieveOfferTransactions(dbOffer.id, function (err, transactions) {
                if(err.error){
                    return res.json(err);
                }
                var offer = new Offer(dbOffer.id, dbOffer.offer_name);
                for(const transaction of transactions) {
                    offer.addOfferItemTransaction(transaction.item_id, transaction.item_delta);
                }
                offers.push(offer);

                if(offers.length == dbOffers.length) {
                    return res.json(offers);
                }
            });
        };
    });
});

router.get('/:offer', (req, res) => {
    var offer_name = req.params.offer;

    Offers.retrieveByOfferName(offer_name, function (err, dbData) {
        if (err.error) {
            console.log('error retrieving offer object from db');
            return res.json(err);
        }

        console.log(dbData);
        
        if(dbData.length === 0) {
            return res.json();
        }

        var id = dbData[0].offer_id;


        let offer = new Offer(id, offer_name);

        dbData.forEach(dbDataLine => {
            offer.addOfferItemTransaction(dbDataLine.item_id, dbDataLine.item_delta);
        });
        return res.json(offer);
    });
});

router.post('/', function (req, res) {
    var offer_name = req.body.offer_name;
    var itemTransactions = req.body.transactions;
    Offers.insert(offer_name, (err, offerResult) => {
        if (err.error){
            return res.json(err);
        }
        let reformatedTransactions = itemTransactions.map(obj => {
            let rObj = [];
            rObj.push(offerResult.id);
            rObj.push(obj.itemId);
            rObj.push(obj.itemDelta);
            return rObj;
        });
        Offers.insertOfferTransactions(reformatedTransactions, function(err, offerTransactionResult) {
            if(err.error){
                return res.json(err);
            }
        });
        return res.json(offerResult);
    });
});

module.exports = router;