const db = require('../database');
const request = require('request-promise');

class Items {
    static retrieveAll (callback) {
        db.query('Select * from items', (err, res) => {
            if(err.error)
                return callback(err);
            callback(res);
        });
    }

    //just an example how to make API call to another service
    static retrieveExternal (callback) {
        request({
            uri: 'https://postman-echo.com/get?foo1=bar1',
            json: true
        }).then(function (res) {
            callback(res);
        }).catch(function (err) {
            console.log(err);
            callback({ error: 'Could not reach endpoint API.' });
        });
    }

    static insert (item, max_quantity, callback) {
        db.query('Insert INTO items (item_name, max_quantity) VALUES ($1, $2)', [item, max_quantity], (err, res) => {
            if(err.error)
                return callback(err);
            callback(res);
        });
    }
}

module.exports = Items;