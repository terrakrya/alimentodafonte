var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  populate = require('../utils').populate,
  Collection = mongoose.model('Collection');

router.get('/', auth.manager, function(req, res) {
  var filters = {}
  if (auth.isCollector(req) && !auth.isManager(req)) {
    filters['collector'] = req.payload.id
  }
  Collection.find(filters).populate(populate(req)).exec(function(err, collections) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(collections);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  Collection.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, collection) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(collection);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newCollection = new Collection(req.body);
  if (auth.isCollector(req) && !auth.isManager(req)) {
    newCollection['collector'] = req.payload.id
  }
  newCollection.save(function(err, collection) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      res.send(collection);
    }
  });
});

router.put('/:id', auth.manager, function(req, res) {
  var filters = {
    _id: req.params.id
  }

  if (auth.isCollector(req) && !auth.isManager(req)) {
    filters['collector'] = req.payload.id
  }

  Collection.findOneAndUpdate(filters, {
    $set: req.body
  }, {
    upsert: true
  }, function(err, newCollection) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newCollection);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {
  var filters = {
    _id: req.params.id
  }

  if (auth.isCollector(req) && !auth.isManager(req)) {
    filters['collector'] = req.payload.id
  }
  
  Collection.findOneAndRemove(filters, function(err, collection) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message);
    } else {
      res.send(collection);
    }
  });
});

module.exports = router;
