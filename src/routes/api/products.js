var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify'),
  auth = require('../auth'),
  populate = require('../utils').populate,
  select = require('../utils').select,
  User = mongoose.model('User'),
  Product = mongoose.model('Product');

router.get('/', auth.producer, function(req, res) {
  var query = {}
  if (auth.isManager(req)) {
    query.organization = req.payload.organization
  }
  if (auth.isProducer(req)) {
    query.producer = req.payload.id
  }
  Product.find(query, select(req)).populate(populate(req)).exec(function(err, products) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      res.json(products);
    }
  });
});

router.get('/slug', auth.producer, function(req, res) {
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

router.get('/tags', function(req, res) {
  Product.find({}, 'tags').exec(function(err, products) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      var tags = {}
      products.forEach(product => {
        product.tags.forEach(tag => {
          tags[tag.text] = {text: tag.text}
        })
      })
      res.json(Object.values(tags));
    }
  });
});

router.get('/:id', auth.producer, function(req, res) {
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

router.post('/', auth.producer, function(req, res) {
  var newProduct = new Product(req.body);
  newProduct.slug = slugify(newProduct.name).toLowerCase()
  var producerId = newProduct.producer
  if (auth.isProducer(req)) {
    producerId = req.payload.id
  }
  User.findOne({
    _id: producerId
  }).exec(function(err, producer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      newProduct.producer = producer._id
      if (producer.organizations && producer.organizations.length > 0) {
        newProduct.organization = producer.organizations[0]
      }
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

router.put('/:id', auth.producer, function(req, res) {
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

router.delete('/:id', auth.producer, function(req, res) {

  Product.findOne({
    _id: req.params.id
  }).populate('offers').exec(function(err, product) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (product.offers && product.offers.length) {
        res.status(422).send('Não é possível excluír! Existem ofertas deste produto cadastradas');
      } else {
        product.offers.forEach(offer => {
          offer.remove();
        })
        product.remove();
        res.send(product);
      }
    }
  })

});

module.exports = router;
