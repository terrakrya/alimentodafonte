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
  }).populate(req.query.populate || '').exec(function(err, seed) {
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
  SeedsHouse.findByIdAndRemove({
    _id: req.params.id
  }, function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message);
    } else {
      res.send(seed);
    }
  });
});

module.exports = router;
