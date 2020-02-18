var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify')
  auth = require('../auth'),
  select = require('../utils').select,
  populate = require('../utils').populate,
  ProductVariation = mongoose.model('ProductVariation');
  Offer = mongoose.model('Offer');

router.get('/', auth.manager, function(req, res) {
  var query = {}
  if (req.payload.roles.includes('manager')) {
    query.organization = req.payload.organization
  }
  Offer.find(query, select(req)).populate(populate(req)).exec(function(err, offers) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(offers);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
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


router.post('/', auth.manager, function(req, res) {
  var newOffer = new Offer(req.body);
  ProductVariation.findOne({
    _id: newOffer.product_variation
  }).populate('product').exec(function(err, product_variation) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      console.log(product_variation);
      newOffer.organization = product_variation.organization
      newOffer.product = product_variation.product._id
      newOffer.supplier = product_variation.product.supplier
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

router.put('/:id', auth.manager, function(req, res) {
  params = req.body
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

router.delete('/:id', auth.manager, function(req, res) {

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
