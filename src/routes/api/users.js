var mongoose = require('mongoose'),
  router = require('express').Router(),
  passport = require('passport'),
  auth = require('../auth'),
  populate = require('../utils').populate,
  User = mongoose.model('User');

router.get('/users', auth.manager, function(req, res) {
  var filters = {}
  if (req.query.role && req.query.role != 'user') {
    filters = {
      roles: req.query.role
    }
  }

  User.find(filters).populate(populate(req)).exec(function(err, seeds) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err);
    } else {
      res.json(seeds);
    }
  });
});

router.get('/users/:id', auth.manager, function(req, res, next) {
  User.findById(req.params.id).then(function(user) {
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json(user);
  }).catch(next);
});

router.post('/users', auth.manager, function(req, res, next) {
  var user = new User();

  user.cnpj = req.body.cnpj
  user.email = req.body.email
  user.name = req.body.name
  user.organization = req.body.organization

  if (req.payload.roles.includes('admin')) {
    user.roles = req.body.roles
  } else {
    user.roles = req.body.roles.filter(value => {
      value == 'admin'
    })
  }

  user.setPassword(req.body.password);

  user.save().then(function() {
    return res.send(user);
  }).catch(next);
});

router.put('/users/:id', auth.manager, function(req, res, next) {
  User.findById(req.params.id).then(function(user) {

    user.cnpj = req.body.cnpj
    user.email = req.body.email
    user.name = req.body.name

    if (req.payload.roles.includes('admin')) {
      user.roles = req.body.roles
    }

    if (req.body.password) {
      user.setPassword(req.body.password);
    }

    user.save().then(function() {
      return res.send(user);
    }).catch(next);
  })
});

router.delete('/users/:id', auth.manager, function(req, res) {
  User.findOne({
    _id: req.params.id
  }).populate('collectors_group collections collection_areas collectors_requests orders potential_lists seeds_matrixes stock_ins stock_outs seeds_houses seeds_houses_collector').exec(function(err, user) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (req.payload.id == req.params.id) {
        res.status(422).send('Não é possível excluír você mesmo!');
      } else if (user.collectors_group && user.collectors_group) {
        res.status(422).send('Não é possível excluír! Este coletor está relacionado ao grupo: ' + user.collectors_group.name);
      } else if (user.collections && user.collections.length) {
        res.status(422).send('Não é possível excluír! Existem coletas cadastradas para este coletor');
      } else if (user.collection_areas && user.collection_areas.length) {
        res.status(422).send('Não é possível excluír! Existem áreas de coleta cadastradas para este coletor');
      } else if (user.stock_ins && user.stock_ins.length) {
        res.status(422).send('Não é possível excluír! Existem entradas no estoque cadastradas para este coletor');
      } else if (user.stock_outs && user.stock_outs.length) {
        res.status(422).send('Não é possível excluír! Existem saídas do estoque cadastradas para este cliente');
      } else if (user.collectors_requests && user.collectors_requests.length) {
        res.status(422).send('Não é possível excluír! Existem pedidos cadastrados para este coletor: (' + user.collectors_requests.map(c => 'Pedido ' + c.code).join(', ') + ')');
      } else if (user.potential_lists && user.potential_lists.length) {
        res.status(422).send('Não é possível excluír! Existem listas de potencial cadastradas para este coletor: (' + user.potential_lists.map(p => 'Lista ' + p.code).join(', ') + ')');
      } else if (user.orders && user.orders.length) {
        res.status(422).send('Não é possível excluír! Existem encomendas cadastradas para este coletor: (' + user.orders.map(p => 'Encomenda ' + p.code).join(', ') + ')');
      } else if (user.seeds_matrixes && user.seeds_matrixes.length) {
        res.status(422).send('Não é possível excluír! Existem matrixes de semente relacionadas a este coletor');
      } else if (user.seeds_houses && user.seeds_houses.length) {
        res.status(422).send('Não é possível excluír! Existem casas de semente relacionados a este proprietário: (' + user.seeds_houses.map(p => p.name).join(', ') + ')');
      } else if (user.seeds_houses_collector && user.seeds_houses_collector.length) {
        res.status(422).send('Não é possível excluír! Existem casas de sementes relacionadas a este coletor: (' + user.seeds_houses_collector.map(p => p.name).join(', ') + ')');
      } else {
        user.remove();
        res.send(user);
      }
    }
  })
});

router.post('/users/login', function(req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({
      errors: {
        email: "can't be blank"
      }
    });
  }

  if (!req.body.password) {
    return res.status(422).json({
      errors: {
        password: "can't be blank"
      }
    });
  }

  passport.authenticate('local', {
    session: false
  }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json(user.toAuthJSON());
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.get('/init', function(req, res) {
  User.find({
    roles: 'admin'
  }).populate(populate(req)).exec(function(err, users) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err);
    } else {
      if (users && users.length == 0) {
        var user = new User();

        user.name = 'Administrador do sistema'
        user.email = 'admin@sociobio.com'
        user.cnpj = 'admin'
        user.roles = ['admin']

        user.setPassword('zyY5TeRl8k');

        user.save().then(function() {
          return res.send(user);
        }).catch(e => {
          return res.send(e)
        });
      } else {
        res.send('Admin já cadastrado')
      }
    }
  });
});

router.get('/is_alive', function(req, res) {
  User.count().exec(function(err) {
    if (!err) {
      res.send('yep')
    }
  });

});

module.exports = router;
