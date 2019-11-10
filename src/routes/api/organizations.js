var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify')
  auth = require('../auth'),
  populate = require('../utils').populate,
  request = require('request'),
  Organization = mongoose.model('Organization'),
  User = mongoose.model('User');

router.get('/', auth.manager, function(req, res) {
  Organization.find({}).exec(function(err, seeds) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(seeds);
    }
  });
});


router.get('/search', auth.manager, function(req, res) {
  Organization.findOne({
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
  Organization.findOne({
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
  var params = req.body
  var newOrganization = new Organization(params);
  newOrganization.cnpj = newOrganization.cnpj.replace(/\D/g, '')

  request('https://www.receitaws.com.br/v1/cnpj/' + newOrganization.cnpj, {
    json: true
  }, (err, resp, body) => {
    if (err) {
      res.status(422).send('Ocorreu um erro ao cadastrar: ' + err.message);
    } else {
      newOrganization.name = body.fantasia
      if (!newOrganization.name) {
        newOrganization.name = body.nome
      }
      newOrganization.slug = slugify(newOrganization.name).toLowerCase()
      newOrganization.corporate_name = body.nome
      if (body.atividade_principal && body.atividade_principal.length) {
        newOrganization.description = body.atividade_principal[0].text
      }
      newOrganization.address = {
        uf: body.uf,
        city: body.municipio,
        postal_code: body.cep,
        address: [body.logradouro, body.numero, body.bairro].join(', ')
      }
      if (body.email) {
        newOrganization.email = body.email
      }
      if (body.telefone) {
        newOrganization.phones = body.telefone.split(' / ')
      }
      newOrganization.contact_persons = []
      if (body.qsa && body.qsa.length) {
        body.qsa.forEach(contact_person => {
            newOrganization.contact_persons.push({
              name: contact_person.nome,
              position: contact_person.qual.split('-')[1]
            })
        })
      }

      newOrganization.legal_format = body.natureza_juridica
      newOrganization.legal_format = body.natureza_juridica
      newOrganization.tax_regime = body.porte
      newOrganization.subscription = body.abertura
      newOrganization.save(function(err, organization) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          var newUser = new User({
            cnpj: organization.cnpj,
            email: params.email,
            password: params.password,
            name: organization.name,
            roles: ['manager'],
            organization: organization._id,
          });
          newUser.save(function(err, user) {
            if (err) {
              res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
            } else {
              res.send(organization);
            }
          });
        }
      });
    }
  });

});

router.put('/:id', auth.manager, function(req, res) {
  params = req.body
  Organization.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: params
  }, {
    upsert: true
  }, function(err, newOrganization) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newOrganization);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {

  Organization.findOne({
    _id: req.params.id
  }).populate('users').exec(function(err, organization) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      organization.users.forEach(user => {
        user.remove();
      })
      // if (organization.collections && organization.collections.length) {
      //   res.status(422).send('Não é possível excluír! Existem coletas cadastradas para este grupo');
      // } else if (organization.collection_areas && organization.collection_areas.length) {
      //   res.status(422).send('Não é possível excluír! Existem áreas de coleta cadastradas para este grupo');
      // } else if (organization.stock_ins && organization.stock_ins.length) {
      //   res.status(422).send('Não é possível excluír! Existem entradas no estoque cadastradas para este grupo');
      // } else if (organization.collectors_requests && organization.collectors_requests.length) {
      //   res.status(422).send('Não é possível excluír! Existem pedidos para coletores cadastrados para este grupo: ('+organization.collectors_requests.map(c => 'Pedido '+ c.code).join(', ') +')');
      // } else if (organization.potential_lists && organization.potential_lists.length) {
      //   res.status(422).send('Não é possível excluír! Existem listas de potencial cadastradas para este grupo: ('+organization.potential_lists.map(p => 'Lista '+ p.code).join(', ') +')');
      // } else if (organization.seeds_matrixes && organization.seeds_matrixes.length) {
      //   res.status(422).send('Não é possível excluír! Existem matrixes de semente relacionadas a este grupo');
      // } else if (organization.seeds_houses && organization.seeds_houses.length) {
      //   res.status(422).send('Não é possível excluír! Existem grupos de coletores relacionados a este grupo: ('+organization.seeds_houses.map(p => p.name).join(', ') +')');
      // } else {
      organization.remove();
      res.send(organization);
      // }
    }
  })

});

module.exports = router;
