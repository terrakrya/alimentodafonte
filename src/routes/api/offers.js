var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  select = require('../utils').select,
  populate = require('../utils').populate,
  Product = mongoose.model('Product'),
  Offer = mongoose.model('Offer');

router.get('/', auth.producer, function(req, res) {
  var query = {}
  if (auth.isManager(req)) {
    query.organization = req.payload.organization
  }
  if (auth.isProducer(req)) {
    query.producer = req.payload.id
  }
  Offer.find(query, select(req)).populate(populate(req)).exec(function(err, offers) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      res.json(offers);
    }
  });
});

router.get('/:id', auth.producer, function(req, res) {
  Offer.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, offer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(offer);
    }
  });
});


router.post('/', auth.producer, function(req, res) {
  var newOffer = new Offer(req.body);
  Product.findOne({
    _id: newOffer.product
  }).populate('product').exec(function(err, product) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      newOffer.product = product._id
      newOffer.organization = product.organization
      newOffer.producer = product.producer
      newOffer.save(function(err, offer) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          res.send(offer);
        }
      });
    }
  });
});

router.put('/:id', auth.producer, function(req, res) {
  var params = req.body
  Offer.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: params
  }, {
    upsert: true
  }, function(err, newOffer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newOffer);
    }
  });
});

router.delete('/:id', auth.producer, function(req, res) {

  Offer.findOne({
    _id: req.params.id
  }).populate('').exec(function(err, offer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      offer.remove();
      res.send(offer);
    }
  })

});

module.exports = router;
