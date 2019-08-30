var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify')
  auth = require('../auth'),
  populate = require('../utils').populate,
  CollectorsGroup = mongoose.model('CollectorsGroup');

router.get('/', auth.manager, function(req, res) {
  CollectorsGroup.find({}).exec(function(err, seeds) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(seeds);
    }
  });
});


router.get('/search', auth.manager, function(req, res) {
  CollectorsGroup.findOne({
    name: req.query.name
  }).exec(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(seed);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  CollectorsGroup.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(seed);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var newCollectorsGroup = new CollectorsGroup(req.body);
  newCollectorsGroup.slug = slugify(newCollectorsGroup.name).toLowerCase()
  newCollectorsGroup.save(function(err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      res.send(seed);
    }
  });
});

router.put('/:id', auth.manager, function(req, res) {
  params = req.body
  params.slug = slugify(params.name).toLowerCase()
  CollectorsGroup.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: params
  }, {
    upsert: true
  }, function(err, newCollectorsGroup) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newCollectorsGroup);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {

  CollectorsGroup.findOne({
    _id: req.params.id
  }).populate('collections collection_areas collectors_requests potential_lists seeds_matrixes stock_ins seeds_houses').exec(function(err, collectors_group) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (collectors_group.collections && collectors_group.collections.length) {
        res.status(422).send('Não é possível excluír! Existem coletas cadastradas para este grupo');
      } else if (collectors_group.collection_areas && collectors_group.collection_areas.length) {
        res.status(422).send('Não é possível excluír! Existem áreas de coleta cadastradas para este grupo');
      } else if (collectors_group.stock_ins && collectors_group.stock_ins.length) {
        res.status(422).send('Não é possível excluír! Existem entradas no estoque cadastradas para este grupo');
      } else if (collectors_group.collectors_requests && collectors_group.collectors_requests.length) {
        res.status(422).send('Não é possível excluír! Existem pedidos para coletores cadastrados para este grupo: ('+collectors_group.collectors_requests.map(c => 'Pedido '+ c.code).join(', ') +')');
      } else if (collectors_group.potential_lists && collectors_group.potential_lists.length) {
        res.status(422).send('Não é possível excluír! Existem listas de potencial cadastradas para este grupo: ('+collectors_group.potential_lists.map(p => 'Lista '+ p.code).join(', ') +')');
      } else if (collectors_group.seeds_matrixes && collectors_group.seeds_matrixes.length) {
        res.status(422).send('Não é possível excluír! Existem matrixes de semente relacionadas a este grupo');
      } else if (collectors_group.seeds_houses && collectors_group.seeds_houses.length) {
        res.status(422).send('Não é possível excluír! Existem grupos de coletores relacionados a este grupo: ('+collectors_group.seeds_houses.map(p => p.name).join(', ') +')');
      } else {
        collectors_group.remove();
        res.send(collectors_group);
      }
    }
  })

});

module.exports = router;
