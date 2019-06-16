var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  populate = require('../utils').populate,
  CollectorsRequest = mongoose.model('CollectorsRequest');

router.get('/', auth.manager, function(req, res) {
  CollectorsRequest.find({}).populate(populate(req)).exec(function(err, seeds) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(seeds);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  CollectorsRequest.findOne({
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
  var newCollectorsRequest = new CollectorsRequest(req.body);
  console.log(newCollectorsRequest);

  CollectorsRequest.find().sort({ code: -1 }).limit(1).exec(function(err, latest) {
    if (!err) {
      if (latest && latest.length) {
        newCollectorsRequest.code = latest[0].code+1
      } else {
        newCollectorsRequest.code = 1
      }
      newCollectorsRequest.save(function(err, seed) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          res.send(seed);
        }
      });
    }
  })
});

router.put('/:id', auth.manager, function(req, res) {
  CollectorsRequest.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }, {
    upsert: true
  }, function(err, newCollectorsRequest) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newCollectorsRequest);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {
  CollectorsRequest.findByIdAndRemove({
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
