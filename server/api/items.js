var express = require('express');
var Items = require('../models/items');

var router = express.Router();

router.get('/', function (req, res) {
    Items.retrieveAll(function (err, items) {
        if (err)
            return res.json(err);
        return res.json(items);
    });
});

router.get('/test', function (req, res) {
    Items.retrieveExternal(function (err, returnValue) {
        if(err)
            return res.json(err);
        return res.json(returnValue);
    });
})

router.post('/', function (req, res) {
    var item_name = req.body.item_name;
    var max_quantity = req.body.max_quantity;
    
    Items.insert(item_name, max_quantity, (err, result) => {
        if (err)
          return res.json(err);
        return res.json(result);
    });
});

module.exports = router;