var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  utils = require('../utils'),
  Seed = mongoose.model('Seed'),
  CollectorsRequest = mongoose.model('CollectorsRequest'),
  StockIn = mongoose.model('StockIn');

router.get('/requests', auth.collector, function(req, res) {
  CollectorsRequest.find({
    collector: req.payload.id
  }, utils.select(req)).populate(utils.populate(req)).exec(function(err, collector_requests) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(collector_requests);
    }
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
