var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify'),
  auth = require('../auth'),
  populate = require('../utils').populate,
  select = require('../utils').select,
  Product = mongoose.model('Product'),
  ProductVariation = mongoose.model('ProductVariation');

router.get('/', auth.manager, function(req, res) {
  var query = {}
  if (req.payload.roles.includes('manager')) {
    query.organization = req.payload.organization
  }
  ProductVariation.find(query, select(req)).populate(populate(req)).exec(function(err, product_variations) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      res.json(product_variations);
    }
  });
});

router.get('/slug', auth.manager, function(req, res) {
  ProductVariation.findOne({
    slug: slugify(req.query.name).toLowerCase()
  }).exec(function(err, product_variation) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(product_variation);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  ProductVariation.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, product_variation) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(product_variation);
    }
  });
});


router.post('/', auth.manager, function(req, res) {
  var newProductVariation = new ProductVariation(req.body);
  newProductVariation.slug = slugify(newProductVariation.name).toLowerCase()

  Product.findOne({
    _id: newProductVariation.product
  }).exec(function(err, product) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      newProductVariation.organization = product.organization
      newProductVariation.producer = product.producer
      newProductVariation.save(function(err, product_variation) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          res.send(product_variation);
        }
      });
    }
  });


});

router.put('/:id', auth.manager, function(req, res) {
  var params = req.body
  params.slug = slugify(params.name).toLowerCase()
  ProductVariation.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: params
  }, {
    upsert: true
  }, function(err, newProductVariation) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newProductVariation);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {

  ProductVariation.findOne({
    _id: req.params.id
  }).populate('offers').exec(function(err, product_variation) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (product_variation.offers && product_variation.offers.length) {
        res.status(422).send('Não é possível excluír! Existem ofertas cadastradas para este produto');
      } else {
        product_variation.remove();
        res.send(product_variation);
      }
    }
  })

});

module.exports = router;
