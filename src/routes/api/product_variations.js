var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify')
  auth = require('../auth'),
  select = require('../utils').select,
  ProductVariation = mongoose.model('ProductVariation');

router.get('/', auth.collector, function(req, res) {
  ProductVariation.find({}, select(req)).exec(function(err, product_variations) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
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
  }).exec(function(err, product_variation) {
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
  newProductVariation.save(function(err, product_variation) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      res.send(product_variation);
    }
  });
});

router.put('/:id', auth.manager, function(req, res) {
  params = req.body
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
  }).populate('potential_lists orders collectors_requests collectors_groups collections stock_ins stock_outs').exec(function(err, product_variation) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (product_variation.stock_outs && product_variation.stock_outs.length) {
        res.status(422).send('Não é possível excluír! Existem saídas de estoque desta semente');
      } else if (product_variation.stock_ins && product_variation.stock_ins.length) {
        res.status(422).send('Não é possível excluír! Existem entradas de estoque desta semente');
      } else if (product_variation.collectors_requests && product_variation.collectors_requests.length) {
        res.status(422).send('Não é possível excluír! Existem pedidos para coletores cadastrados para esta semente: ('+product_variation.collectors_requests.map(c => 'Pedido '+ c.code).join(', ') +')');
      } else if (product_variation.orders && product_variation.orders.length) {
        res.status(422).send('Não é possível excluír! Existem encomendas cadastradas para esta semente: ('+product_variation.orders.map(o => 'Encomenda '+ o.code).join(', ') +')');
      } else if (product_variation.potential_lists && product_variation.potential_lists.length) {
        res.status(422).send('Não é possível excluír! Existem listas de potencial cadastradas para esta semente: ('+product_variation.potential_lists.map(p => 'Lista '+ p.code).join(', ') +')');
      } else if (product_variation.collections && product_variation.collections.length) {
        res.status(422).send('Não é possível excluír! Existem coletas relacionadas a esta semente');
      } else if (product_variation.collectors_groups && product_variation.collectors_groups.length) {
        res.status(422).send('Não é possível excluír! Existem grupos de coletores relacionados a esta semente: ('+product_variation.collectors_groups.map(p => p.name).join(', ') +')');
      } else {
        product_variation.remove();
        res.send(product_variation);
      }
    }
  })

});

module.exports = router;
