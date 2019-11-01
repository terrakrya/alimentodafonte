var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  populate = require('../utils').populate,
  Lot = mongoose.model('Lot');

router.get('/', auth.manager, function(req, res) {
  Lot.find({}).populate(populate(req)).exec(function(err, seeds) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(seeds);
    }
  });
});

router.get('/:code', auth.manager, function(req, res) {
  Lot.findOne({
    code: req.params.code
  }).populate(populate(req)).exec(function(err, lot) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(lot);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newLot = new Lot(req.body);
  newLot.save(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      res.send(seed);
    }
  });
});

module.exports = router;
