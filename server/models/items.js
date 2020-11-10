const db = require('../database');
const request = require('request-promise');

class Items {
    static retrieveAll (callback) {
        db.query('Select * from items', (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        });
    }

    static retrieveByItemName (item, callback) {
        db.query(`Select * from items Where item_name = '${item}'`, (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        });
    }

    //just an example how to make API call to another service
    static retrieveExternal (callback) {
        request({
            uri: 'https://postman-echo.com/get?foo1=bar1',
            json: true
        }).then(function (res) {
            callback({}, res);
        }).catch(function (err) {
            console.log(err);
            callback({ error: 'Could not reach endpoint API.' }, null);
        });
    }

    static insert (item, quantity, max_quantity, callback) {
        db.query('Insert INTO items (item_name, quantity, max_quantity) VALUES ($1, $2, $3)', [item, quantity, max_quantity], (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        });
    }
}

module.exports = Items;