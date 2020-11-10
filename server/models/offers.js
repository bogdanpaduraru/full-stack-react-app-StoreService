const db = require('../database');
const request = require('request-promise');

class Offers {
    static retrieveAll (callback) {
        db.query('Select * from offers', (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        });
    }

    static retrieveByOfferName (offer, callback) {
        var query = `Select * from offers Where offer_name = '${offer}'`;
        db.query(query, (err, res) => {
            if(err.error) {
                console.log('error from query');
                return callback(err, null);
            }
            callback({}, res[0]);
        });
    }
    
    static insert (offer, callback) {
        db.query('Insert INTO offers (offer_name) VALUES ($1)', [offer], (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        });
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