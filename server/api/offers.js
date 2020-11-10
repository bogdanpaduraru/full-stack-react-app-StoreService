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
                console.log(offer);
                for(const transaction of transactions) {
                    offer.addOfferItemTransaction(transaction.item_id, transaction.item_delta);
                }
                offers.push(offer);
                console.log(offer);

                if(offers.length == dbOffers.length) {
                    return res.json(offers);
                }
            });
        };
    });
});

router.get('/:offer', (req, res) => {
    var offer_name = req.params.offer;

    Offers.retrieveByOfferName(offer_name, function (err, dbOffer) {
        if (err.error) {
            console.log('error retrieving offer object from db');
            return res.json(err);
        }
        
        var id = dbOffer.id;

        var dbOffer_name = dbOffer.offer_name;

        let offer = new Offer(dbOffer.id, dbOffer.offer_name);
        
        Offers.retrieveOfferTransactions(id, function (err, transactions) {
            if(err.error){
                return res.json(err);
            }
            transactions.forEach(transaction => {
                offer.addOfferItemTransaction(transaction.item_id, transaction.item_delta);
            });
            return res.json(offer);
        });
    });
});

router.post('/', function (req, res) {
    var offer_name = req.body.offer_name;
    //TODO: handle all the item transactions
    
    Offers.insert(offer_name, (err, result) => {
        if (err)
          return res.json(err);
        return res.json(result);
    });
});

module.exports = router;