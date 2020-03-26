var mongoose = require('mongoose'),
  router = require('express').Router(),
  passport = require('passport'),
  auth = require('../auth'),
  populate = require('../utils').populate,
  User = mongoose.model('User'),
  Product = mongoose.model('Product');

router.get('/users', auth.manager, function(req, res) {
  var filters = {}
  if (req.query.role && req.query.role != 'user') {
    filters = {
      roles: req.query.role
    }
  }

  User.find(filters).populate(populate(req)).exec(function(err, users) {
    if (err) {
      res.status(422).send('Erro:: ' + err);
    } else {
      res.json(users);
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

router.post('/register', function(req, res, next) {
  var user = new User();

  user.cnpj = req.body.cnpj.replace(/\D/g, '')
  user.address = req.body.address
  user.email = req.body.email
  user.name = req.body.name
  user.phone = req.body.phone
  user.roles = ['client']

  user.setPassword(req.body.password);

  console.log(user);
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
  }).exec(function(err, user) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (req.payload.id == req.params.id) {
        res.status(422).send('Não é possível excluír você mesmo!');
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
      res.status(422).send('Erro:: ' + err);
    } else {
      if (users && users.length == 0) {
        var user = new User();

        var username = "admin@alimentodafonte.com"
        var password = Math.random().toString(36).substring(7)

        user.setPassword(password);

        user.name = 'Administrador do sistema'
        user.email = 'admin@alimentodafonte.com'
        user.cnpj = '000'
        user.roles = ['admin']


        user.save().then(function() {
          return res.send({
            status: 'success',
            user: username,
            password: password
          });
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

router.get('/fix_data', function(req, res) {
  Product.find().populate('supplier product_variations').exec(function(err, products) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      products.forEach(product => {
        var org = product.supplier.organizations[0]
        product.organization = org
        product.save(function(err) {
          if (err) {
            res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
          } else {
            product.product_variations.forEach(product_variation => {
              product_variation.organization = org
              if (!product_variation.images || product_variation.images.length == 0) {
                product_variation.images = product.images
              }
              product_variation.save(function(err) {
                if (err) {
                  res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
                } else {
                  res.send('Salvo' + err.message);
                }
              });
            })
          }
        });

      })
    }
  })

});

module.exports = router;
