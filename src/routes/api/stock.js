var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  Seed = mongoose.model('Seed'),
  StockIn = mongoose.model('StockIn'),
  StockOut = mongoose.model('StockOut');

router.get('/', auth.manager, function(req, res) {
  StockIn.find({}).populate('seeds_house stock_items.seed stock_items.lot collectors_group collector').exec(function(err, stock_ins) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      StockOut.find({}).populate('seeds_house seed lot buyer').exec(function(err, stock_outs) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
        } else {
          res.json(stock_outs.concat(stock_ins));
        }
      });
    }
  });
});

router.get('/fix_stock_items', auth.manager, function(req, res) {
  StockIn.find({}).exec(function(err, stock_ins) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      stock_ins.forEach(stock_in => {
        if (!stock_in.stock_items.length && stock_in.seed) {
          console.log('aaaaaa');
          console.log(stock_in);
          stock_in.stock_items.push({
            seed: stock_in.seed,
            lot: stock_in.lot,
            qtd: stock_in.qtd,
            collection_date: stock_in.collection_date,
            number_of_matrixes: stock_in.number_of_matrixes,
            compensation_collect: stock_in.compensation_collect,
            price: stock_in.price,
            wholesale_price: stock_in.wholesale_price,
          })
          stock_in.save()
        }
      })
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newStockIn = new StockIn(req.body);
  newStockIn.save(function(err, stock_in) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
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
    }
  });
});

module.exports = router;
