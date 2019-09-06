var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  populate = require('../utils').populate,
  Seed = mongoose.model('Seed'),
  StockIn = mongoose.model('StockIn');

router.get('/', auth.manager, function(req, res) {
  StockIn.find({}).exec(function(err, stock_ins) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(stock_ins);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newStockIn = new StockIn(req.body);
  Seed.findOne({
    _id: newStockIn.seed
  }).exec(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      newStockIn.price = seed.price
      newStockIn.compensation_collect = seed.compensation_collect
      newStockIn.wholesale_price = seed.wholesale_price
      newStockIn.save(function(err, stock_in) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar o item: ' + err.message);
        } else {
          seed.stock += stock_in.qtd
          seed.save()
          res.json(stock_in);
        }
      });
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  StockIn.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, stock_in) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(stock_in);
    }
  });
});

module.exports = router;
