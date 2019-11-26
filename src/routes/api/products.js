var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify')
  auth = require('../auth'),
  select = require('../utils').select,
  Product = mongoose.model('Product');

router.get('/', auth.collector, function(req, res) {
  Product.find({}, select(req)).populate(populate(req)).exec(function(err, products) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      if (req.payload.roles.includes('manager')) {
        products = products.filter(product =>{
          console.log('product.supplier');
          console.log(product.supplier);
          if (product.supplier) {
            return product.supplier.organizations.includes(req.payload.organization)
          }
          return false
        })
      }

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
  newProduct.save(function(err, product) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      res.send(product);
    }
  });
});

router.put('/:id', auth.manager, function(req, res) {
  params = req.body
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
  }).populate('potential_lists orders collectors_requests collectors_groups collections stock_ins stock_outs').exec(function(err, product) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (product.stock_outs && product.stock_outs.length) {
        res.status(422).send('Não é possível excluír! Existem saídas de estoque desta semente');
      } else if (product.stock_ins && product.stock_ins.length) {
        res.status(422).send('Não é possível excluír! Existem entradas de estoque desta semente');
      } else if (product.collectors_requests && product.collectors_requests.length) {
        res.status(422).send('Não é possível excluír! Existem pedidos para coletores cadastrados para esta semente: ('+product.collectors_requests.map(c => 'Pedido '+ c.code).join(', ') +')');
      } else if (product.orders && product.orders.length) {
        res.status(422).send('Não é possível excluír! Existem encomendas cadastradas para esta semente: ('+product.orders.map(o => 'Encomenda '+ o.code).join(', ') +')');
      } else if (product.potential_lists && product.potential_lists.length) {
        res.status(422).send('Não é possível excluír! Existem listas de potencial cadastradas para esta semente: ('+product.potential_lists.map(p => 'Lista '+ p.code).join(', ') +')');
      } else if (product.collections && product.collections.length) {
        res.status(422).send('Não é possível excluír! Existem coletas relacionadas a esta semente');
      } else if (product.collectors_groups && product.collectors_groups.length) {
        res.status(422).send('Não é possível excluír! Existem grupos de coletores relacionados a esta semente: ('+product.collectors_groups.map(p => p.name).join(', ') +')');
      } else {
        product.remove();
        res.send(product);
      }
    }
  })

});

module.exports = router;
