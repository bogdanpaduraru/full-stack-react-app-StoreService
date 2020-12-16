const { json } = require('body-parser');
var express = require('express');
var Inventory = require('../models/inventory');

var router = express.Router();

router.get('/:profile_id', (req, res ) => {
    var profile_id = req.params.profile_id;
    Inventory.retrieveInventory(profile_id, function(err, inventory) {
        if(err.error)
            return res.json(err);
        return res.json(inventory);
    });
});

router.post('/', (req, res) => {
    var item_id = req.body.item_id;
    var item_quantity = req.body.item_quantity;
    var profile_id = req.body.profile_id;

    Inventory.insert(item_id, item_quantity, profile_id, function(err, result) {
        if(err.error)
            return res.json(err);
        return res.json(result);
    });
});

router.put('/', (req, res) => {
    var item_id = req.body.item_id;
    var item_quantity = req.body.item_quantity;
    var profile_id = req.body.profile_id;

    Inventory.update(item_id, item_quantity, profile_id, function(err, result) {
        if(err.error)
            return res.json(err);
        return res.json(result);
    });
});

router.delete('/', (req, res) => {
    var item_id = req.body.item_id;
    var profile_id = req.body.profile_id;

    Inventory.delete(item_id, profile_id, function(err, result) {
        if(err.error)
            return res.json(err);
        return res.json(result);
    });
});

module.exports = router;