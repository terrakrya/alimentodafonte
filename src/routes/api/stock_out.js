var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  Seed = mongoose.model('Seed'),
  StockOut = mongoose.model('StockOut');

router.get('/', auth.manager, function(req, res) {
  StockOut.find({}).exec(function(err, stock_outs) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(stock_outs);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newStockOut = new StockOut(req.body);
  Seed.findOne({
    _id: newStockOut.seed
  }).exec(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      if (newStockOut.out_mode == 'Venda Varejo') {
        newStockOut.price = seed.price
      } else if (newStockOut.out_mode == 'Venda Atacado') {
        newStockOut.price = seed.wholesale_price
      } else {
        newStockOut.price = 0
      }
      newStockOut.save(function(err, stock_out) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar o item: ' + err.message);
        } else {
          seed.stock += stock_out.qtd
          seed.save()
          res.json(stock_out);
        }
      });
    }
  });
});

module.exports = router;
