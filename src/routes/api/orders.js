var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  select = require('../utils').select,
  populate = require('../utils').populate,
  ProductVariation = mongoose.model('ProductVariation'),
  Offer = mongoose.model('Offer'),
  Order = mongoose.model('Order');

router.get('/', auth.manager, function(req, res) {
  var query = {
  }
  Order.find(query, select(req)).populate('items.offer').populate(populate(req)).exec(function(err, orders) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      if (req.payload.roles.includes('manager')) {
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

      res.json(orders);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
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
      path: 'product_variation',
      model: 'ProductVariation'
    }, {
      path: 'producer',
      model: 'Producer'
    }]
  }).exec(function(err, order) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      if (req.payload.roles.includes('manager')) {
        order.items = order.items.filter(item => {
          return item.offer.organization == req.payload.organization
        })
      }

      res.json(order);
    }
  });
});

router.put('/:id', auth.manager, function(req, res) {
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
