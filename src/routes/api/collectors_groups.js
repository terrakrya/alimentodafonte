var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  CollectorsGroup = mongoose.model('CollectorsGroup'),
  User = mongoose.model('User');

router.get('/', auth.manager, function(req, res) {
  CollectorsGroup.find({}).exec(function(err, seeds) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(seeds);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  CollectorsGroup.findOne({
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
  var newCollectorsGroup = new CollectorsGroup(req.body);
  newCollectorsGroup.save(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      res.send(seed);
    }
  });
});

router.put('/:id', auth.manager, function(req, res) {
  CollectorsGroup.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }, {
    upsert: true
  }, function(err, newCollectorsGroup) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newCollectorsGroup);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {
  CollectorsGroup.findByIdAndRemove({
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
