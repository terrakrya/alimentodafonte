var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  populate = require('../utils').populate,
  fixQtdToNumber = require('../utils').fixQtdToNumber,
  CollectorsRequest = mongoose.model('CollectorsRequest');

router.get('/', auth.manager, function(req, res) {
  CollectorsRequest.find({}).populate(populate(req)).exec(function(err, collector_requests) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(collector_requests);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  CollectorsRequest.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, collector_request) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(collector_request);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newCollectorsRequest = new CollectorsRequest(req.body);

  CollectorsRequest.find().sort({ code: -1 }).limit(1).exec(function(err, latest) {
    if (!err) {
      if (!newCollectorsRequest.code) {
        if (latest && latest.length) {
          newCollectorsRequest.code = latest[0].code+1
        } else {
          newCollectorsRequest.code = 1
        }
      }

      fixQtdToNumber(newCollectorsRequest)

      newCollectorsRequest.save(function(err, collector_request) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          res.send(collector_request);
        }
      });
    }
  })
});

router.put('/:id', auth.manager, function(req, res) {
  var collectors_request = req.body

  fixQtdToNumber(collectors_request)

  CollectorsRequest.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: collectors_request
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
  }, function(err, collector_request) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message);
    } else {
      res.send(collector_request);
    }
  });
});

module.exports = router;
