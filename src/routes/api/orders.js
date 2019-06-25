var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  populate = require('../utils').populate,
  Order = mongoose.model('Order');

router.get('/', auth.manager, function(req, res) {
  Order.find({}).populate(populate(req)).exec(function(err, orders) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(orders);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  Order.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, order) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(order);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newOrder = new Order(req.body);

  Order.find().sort({ code: -1 }).limit(1).exec(function(err, latest) {
    if (!err) {
      if (latest && latest.length) {
        newOrder.code = latest[0].code+1
      } else {
        newOrder.code = 1
      }
      newOrder.save(function(err, order) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          res.send(order);
        }
      });
    }
  })
});

router.put('/:id', auth.manager, function(req, res) {
  Order.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }, {
    upsert: true
  }, function(err, newOrder) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newOrder);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {
  Order.findByIdAndRemove({
    _id: req.params.id
  }, function(err, order) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message);
    } else {
      res.send(order);
    }
  });
});

module.exports = router;
