const db = require('../database');
const request = require('request-promise');

var format = require('pg-format');

class Offers {
    static retrieveAll (callback) {
        db.query('Select * from offers', (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        });
    }

    static retrieveByOfferName (offer, callback) {
        var query = `Select offer_id, offer_name, item_id, item_delta from offers inner join offer_transactions
        on offers.id = offer_transactions.offer_id
        where offer_name = '${offer}' `;
        console.log(query);
        //var query = `Select * from offers Where offer_name = '${offer}'`;
        db.query(query, (err, res) => {
            if(err.error) {
                console.log('error from query');
                return callback(err, null);
            }
            callback({}, res);
        });
    }
    
    static insert (offer, callback) {
        db.query('Insert INTO offers (offer_name) VALUES ($1) Returning id', [offer], (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res[0]);
        });
    }

    static insertOfferTransactions(transactions, callback) {
        var query = format('INSERT INTO offer_transactions(offer_id, item_id, item_delta) VALUES %L', transactions);
        db.query(query, (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        })
    }

    static retrieveOfferTransactions (offer, callback) {
        var query = `Select * from offer_transactions where offer_id = '${offer}'`;
         db.query(query, (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        });
    }
}

module.exports = Offers;