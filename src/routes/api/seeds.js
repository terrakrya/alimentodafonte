var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  select = require('../utils').select,
  Seed = mongoose.model('Seed');

router.get('/', auth.collector, function(req, res) {
  Seed.find({}, select(req)).exec(function(err, seeds) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(seeds);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  Seed.findOne({
    _id: req.params.id
  }).exec(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(seed);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newSeed = new Seed(req.body);
  newSeed.save(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      res.send(seed);
    }
  });
});

router.put('/:id', auth.manager, function(req, res) {
  Seed.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }, {
    upsert: true
  }, function(err, newSeed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newSeed);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {

  Seed.findOne({
    _id: req.params.id
  }).populate('potential_lists orders collectors_requests collectors_groups collections stock_ins stock_outs').exec(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (seed.stock_outs && seed.stock_outs.length) {
        res.status(422).send('Não é possível excluír! Existem saídas de estoque desta semente');
      } else if (seed.stock_ins && seed.stock_ins.length) {
        res.status(422).send('Não é possível excluír! Existem entradas de estoque desta semente');
      } else if (seed.collectors_requests && seed.collectors_requests.length) {
        res.status(422).send('Não é possível excluír! Existem pedidos para coletores cadastrados para esta semente: ('+seed.collectors_requests.map(c => 'Pedido '+ c.code).join(', ') +')');
      } else if (seed.orders && seed.orders.length) {
        res.status(422).send('Não é possível excluír! Existem encomendas cadastradas para esta semente: ('+seed.orders.map(o => 'Encomenda '+ o.code).join(', ') +')');
      } else if (seed.potential_lists && seed.potential_lists.length) {
        res.status(422).send('Não é possível excluír! Existem listas de potencial cadastradas para esta semente: ('+seed.potential_lists.map(p => 'Lista '+ p.code).join(', ') +')');
      } else if (seed.collections && seed.collections.length) {
        res.status(422).send('Não é possível excluír! Existem coletas relacionadas a esta semente');
      } else if (seed.collectors_groups && seed.collectors_groups.length) {
        res.status(422).send('Não é possível excluír! Existem grupos de coletores relacionados a esta semente: ('+seed.collectors_groups.map(p => p.name).join(', ') +')');
      } else {
        seed.remove();
        res.send(seed);
      }
    }
  })

});

module.exports = router;
