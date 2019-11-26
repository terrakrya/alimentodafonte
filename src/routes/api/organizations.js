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
    } else if (body.status == 'ERROR') {
      res.status(422).send(body.message);
    } else if (!body.nome) {
      res.status(422).send('Ocorreu um erro ao validar o CNPJ');
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
          if (err.message.includes('duplicate')) {
            res.status(422).send('Esta organização já está cadastrada');
          } else {
            res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
          }
        } else {
          var newUser = new User({
            cnpj: organization.cnpj,
            email: params.email,
            name: organization.name,
            roles: ['manager'],
            organization: organization._id,
          });
          newUser.setPassword(params.password);
          newUser.save(function(err, user) {
            if (err) {
              organization.remove()
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
  }).populate('users suppliers').exec(function(err, organization) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (organization.suppliers && organization.suppliers.length) {
        res.status(422).send('Não é possível excluír! Existem fornecedores cadastrados nesta organização');
      } else {
        organization.users.forEach(user => {
          user.remove();
        })
        organization.remove();
        res.send(organization);
      }
    }
  })

});

module.exports = router;
