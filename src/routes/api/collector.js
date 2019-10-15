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
    $or: [{
      collector: req.payload.id
    }, {
      'seed_items.qtd.collector': req.payload.id
    }]
  } , 'seed_items collector').populate('seed_items.seed').exec(function(err, collectors_requests) {
    StockIn.find({
      collector: req.payload.id
    }).exec(function(err, stock_ins) {
      collectors_requests.forEach(collectors_request => {
        collectors_request.seed_items.forEach(seed_item => {
          var total_qtd = utils.sumQtd(seed_item, collectors_request.collector, req.payload.id)
          if (total_qtd) {
            console.log('total_qtd');
            console.log(total_qtd);
            let seed_id = seed_item.seed._id
            if (seed_items[seed_id]) {
              seed_items[seed_id].qtd += utils.sumQtd(seed_item, collectors_request.collector, req.payload.id)
            } else {
              var qtd_delivered = 0
              if (stock_ins && stock_ins.length) {
                qtd_delivered = stock_ins.map(stock_in => {
                  if (stock_in.stock_items.find(stock_item => (stock_item.seed.toString() == seed_id.toString()))) {
                    return utils.sumArray(stock_in.stock_items, 'qtd')
                  } else {
                    return 0
                  }
                }).reduce((a, b) => a + b)
              }

              seed_items[seed_id] = {
                seed: seed_item.seed,
                qtd: total_qtd,
                compensation_collect: seed_item.compensation_collect,
                qtd_delivered: qtd_delivered
              }
            }
            seed_items[seed_id].qtd_remaining = seed_items[seed_id].qtd - seed_items[seed_id].qtd_delivered
          }
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

module.exports = router;
