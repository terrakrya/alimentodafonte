var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  utils = require('../utils'),
  CollectorsRequest = mongoose.model('CollectorsRequest'),
  StockIn = mongoose.model('StockIn');

router.get('/requests', auth.collector, function(req, res) {
  var seed_items = {}

  CollectorsRequest.find({
    collector: req.payload.id
  }, 'seed_items').populate('seed_items.seed').exec(function(err, collectors_requests) {
    StockIn.find({
      collector: req.payload.id
    }).exec(function(err, stock_ins) {
      collectors_requests.forEach(collectors_request => {
        collectors_request.seed_items.forEach(seed_item => {
          let seed_id = seed_item.seed._id
          if (seed_items[seed_id]) {
            seed_items[seed_id].qtd += seed_item.qtd
          } else {
            seed_items[seed_id] = {
              seed: seed_item.seed,
              qtd: seed_item.qtd,
              compensation_collect: seed_item.compensation_collect,
              qtd_delivered: stock_ins.map(stock_in => {
                if (stock_in.seed.toString() == seed_id.toString()) {
                  return stock_in.qtd
                } else {
                  return 0
                }
              }).reduce((a, b) => a + b)
            }
          }
          seed_items[seed_id].qtd_remaining = seed_items[seed_id].qtd - seed_items[seed_id].qtd_delivered
        })
      })
      if (err) {
        res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
      } else {
        res.json(Object.values(seed_items));
      }
    })
  });
});

router.get('/stock_ins', auth.collector, function(req, res) {
  StockIn.find({
    collector: req.payload.id
  }, utils.select(req)).populate(utils.populate(req)).exec(function(err, stock_ins) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(stock_ins);
    }
  });
});

// TODO remove on next deploy
router.get('/update_stock_ins_price', function(req, res) {
  StockIn.find().populate('seed').exec(function(err, stock_ins) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      stock_ins.forEach((stock_in, index) => {
        if (stock_in.seed && !stock_in.compensation_collect) {
          console.log('stock_in');
          console.log(stock_in.seed);
          stock_in.compensation_collect = stock_in.seed.compensation_collect
          stock_in.wholesale_price = stock_in.seed.wholesale_price
          console.log(stock_in);
          stock_in.save();
        }
      })
      res.json(stock_ins);
    }
  });
});

module.exports = router;
