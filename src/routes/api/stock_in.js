var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
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
  newStockIn.save(function(err, stock_in) {
    Seed.findOne({
      _id: stock_in.seed
    }).exec(function(err, seed) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao salvar o item: ' + err.message);
      } else {
        seed.stock += stock_in.qtd
        seed.save()
        res.json(stock_in);
      }
    });
  });
});

module.exports = router;
