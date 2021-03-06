var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  select = require('../utils').select,
  populate = require('../utils').populate,
  Offer = mongoose.model('Offer'),
  Order = mongoose.model('Order');

router.get('/', auth.producer, function(req, res) {
  var query = {}

  Order.find(query, select(req)).populate('items.offer').populate(populate(req)).exec(function(err, orders) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      if (auth.isManager(req)) {
        orders = orders.filter(order => {
          return order.items.find(item => {
            return item.offer.organization == req.payload.organization
          })
        })
        orders.map(order => {
          order.items = order.items.filter(item => {
            return item.offer.organization == req.payload.organization
          })
          return order
        })
      }
      if (auth.isProducer(req)) {
        orders = orders.filter(order => {
          return order.items.find(item => {
            return item.offer.producer == req.payload.id
          })
        })
        orders = orders.map(order => {
          order.items = order.items.filter(item => {
            return item.offer.producer == req.payload.id
          })
          return order
        })
      }

      res.json(orders);
    }
  });
});

router.get('/:id', auth.producer, function(req, res) {
  var query = {
    _id: req.params.id
  }
  Order.findOne(query, select(req)).populate({
    path: 'items.offer',
    model: 'Offer',
    populate: [{
      path: 'product',
      model: 'Product'
    }, {
      path: 'producer',
      model: 'User'
    }]
  }).exec(function(err, order) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      if (auth.isManager(req)) {
        order.items = order.items.filter(item => {
          return item.offer.organization == req.payload.organization
        })
      }
      console.log("item.offer.producer");
      if (auth.isProducer(req)) {
        order.items = order.items.filter(item => {
          console.log("item.offer.producer");
          console.log(item.offer.producer);
          console.log(req.payload.id);
          return item.offer.producer._id == req.payload.id
        })
      }

      res.json(order);
    }
  });
});

router.put('/:id', auth.producer, function(req, res) {
  var params = req.body
  Order.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: params
  }, {
    upsert: true
  }, function(err, offer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(offer);
    }
  });
});

module.exports = router;
