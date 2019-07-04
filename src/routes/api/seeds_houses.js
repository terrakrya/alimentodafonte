var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  populate = require('../utils').populate,
  SeedsHouse = mongoose.model('SeedsHouse');

router.get('/', auth.manager, function(req, res) {
  SeedsHouse.find({}).populate(populate(req)).exec(function(err, seeds) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(seeds);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  SeedsHouse.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(seed);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newSeedsHouse = new SeedsHouse(req.body);
  newSeedsHouse.save(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      res.send(seed);
    }
  });
});

router.put('/:id', auth.manager, function(req, res) {
  SeedsHouse.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }, {
    upsert: true
  }, function(err, newSeedsHouse) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newSeedsHouse);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {
  SeedsHouse.findOne({
    _id: req.params.id
  }).populate('lots stock_ins stock_outs').exec(function(err, seeds_house) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (seeds_house.stock_ins && seeds_house.stock_ins.length) {
        res.status(422).send('Não é possível excluír! Existem entradas no estoque cadastradas para esta casa de sementes');
      } else if (seeds_house.stock_outs && seeds_house.stock_outs.length) {
        res.status(422).send('Não é possível excluír! Existem saídas do estoque cadastradas para esta casa de sementes');
      } else if (seeds_house.lots && seeds_house.lots.length) {
        res.status(422).send('Não é possível excluír! Existem lotes relacionados a esta casa de sementes: (' + seeds_house.lots.map(p => p.code).join(', ') + ')');
      } else {
        seeds_house.remove();
        res.send(seeds_house);
      }
    }
  })
});

module.exports = router;
