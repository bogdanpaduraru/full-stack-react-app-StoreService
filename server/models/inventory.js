const db = require('../database');
const request = require('request-promise');

class Inventory {
    static retrieveInventory(profile_id, callback) {
        var query = `select item_id, item_name, item_quantity from items inner join player_inventory
        on items.id = player_inventory.item_id 
        where player_inventory.profile_id = '${profile_id}'`; 
        db.query(query, (err, res) => {
            if(err.error)
                return callback(err, null);
            callback({}, res);
        });
    }

    static insert(item_id, item_quantity, profile_id, callback) {
        var query = `Insert into player_inventory(profile_id, item_id, item_quantity) Values('${profile_id}', '${item_id}', ${item_quantity})`;
        db.query(query, (err, res) => {
            if(err.error)
                return callback(err, null);
            return callback({}, res);
        });
    }

    static update(item_id, item_quantity, profile_id, callback) {
        var query = `Update player_inventory Set item_quantity=${item_quantity} Where profile_id='${profile_id}' 
        AND item_id ='${item_id}'`; 
        db.query(query, (err, res) => {
            if(err.error)
                return callback(err, null);
            return callback({}, res);
        });
    }

    static delete(item_id, profile_id, callback) {
        var query = `Delete from player_inventory Where item_id='${item_id}' AND profile_id='${profile_id}'`;
        db.query(query, (err, res) => {
            if(err.error)
                return callback(err, null);
            return callback({}, res);
        });
    }
}

module.exports = Inventory;