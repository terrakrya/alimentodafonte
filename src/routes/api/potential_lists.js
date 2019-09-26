var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  populate = require('../utils').populate,
  fixQtdToNumber = require('../utils').fixQtdToNumber,
  PotentialList = mongoose.model('PotentialList');

router.get('/', auth.manager, function(req, res) {
  PotentialList.find({}).populate(populate(req)).exec(function(err, potential_lists) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(potential_lists);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  PotentialList.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, potential_list) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(potential_list);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newPotentialList = new PotentialList(req.body);

  PotentialList.find().sort({ code: -1 }).limit(1).exec(function(err, latest) {
    if (!err) {
      if (!newPotentialList.code) {
        if (latest && latest.length) {
          newPotentialList.code = latest[0].code+1
        } else {
          newPotentialList.code = 1
        }
      }

      fixQtdToNumber(newOrder)

      newPotentialList.save(function(err, potential_list) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          res.send(potential_list);
        }
      });
    }
  })
});

router.put('/:id', auth.manager, function(req, res) {

  var potential_list = req.body

  fixQtdToNumber(potential_list)

  PotentialList.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: potential_list
  }, {
    upsert: true
  }, function(err, newPotentialList) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newPotentialList);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {
  PotentialList.findByIdAndRemove({
    _id: req.params.id
  }, function(err, potential_list) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message);
    } else {
      res.send(potential_list);
    }
  });
});

module.exports = router;
