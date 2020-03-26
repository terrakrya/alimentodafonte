var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify'),
  auth = require('../auth'),
  populate = require('../utils').populate,
  select = require('../utils').select,
  Producer = mongoose.model('Producer'),
  Product = mongoose.model('Product');

router.get('/', auth.manager, function(req, res) {
  var query = {}
  if (req.payload.roles.includes('manager')) {
    query.organization = req.payload.organization
  }
  Product.find(query, select(req)).populate(populate(req)).exec(function(err, products) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      res.json(products);
    }
  });
});

router.get('/slug', auth.manager, function(req, res) {
  Product.findOne({
    slug: slugify(req.query.name).toLowerCase()
  }).exec(function(err, product) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(product);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  Product.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, product) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(product);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newProduct = new Product(req.body);
  newProduct.slug = slugify(newProduct.name).toLowerCase()

  Producer.findOne({
    _id: newProduct.producer
  }).exec(function(err, producer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      newProduct.organization = producer.organizations[0]
      newProduct.save(function(err, product) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          res.send(product);
        }
      });
    }
  });

});

router.put('/:id', auth.manager, function(req, res) {
  var params = req.body
  params.slug = slugify(params.name).toLowerCase()
  Product.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: params
  }, {
    upsert: true
  }, function(err, newProduct) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newProduct);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {

  Product.findOne({
    _id: req.params.id
  }).populate('product_variations').exec(function(err, product) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (product.product_variations && product.product_variations.length) {
        res.status(422).send('Não é possível excluír! Existem variações deste produto cadastradas');
      } else {
        product.product_variations.forEach(product_variation => {
          product_variation.remove();
        })
        product.remove();
        res.send(product);
      }
    }
  })

});

module.exports = router;
