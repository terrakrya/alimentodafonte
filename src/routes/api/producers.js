var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify'),
  auth = require('../auth'),
  populate = require('../utils').populate,
  request = require('request'),
  User = mongoose.model('User');

router.get('/', auth.manager, function(req, res) {

  var query = {roles: 'producer'}
  if (req.payload.roles.includes('manager')) {
    query.organizations = req.payload.organization
  }

  User.find(query).exec(function(err, producers) {
    if (err) {
      res.status(422).send('Erro:: ' + err.message);
    } else {
      res.json(producers);
    }
  });
});


router.get('/search', auth.manager, function(req, res) {
  var query = {
    name: req.query.name
  }

  if (req.payload.roles.includes('manager')) {
    query.organizations = req.payload.organization
  }

  User.findOne(query).exec(function(err, producer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(producer);
    }
  });
});

router.get('/:id', auth.manager, function(req, res) {
  User.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, producer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(producer);
    }
  });
});

router.post('/', auth.manager, function(req, res) {
  var params = req.body
  if (req.payload.roles.includes('manager')) {
    params.organizations = [req.payload.organization]
  }

  var newProducer = new User(params);
  newProducer.cnpj = newProducer.cnpj.replace(/\D/g, '')

  request('https://www.receitaws.com.br/v1/cnpj/' + newProducer.cnpj, {
    json: true
  }, (err, resp, body) => {
    if (err) {
      res.status(422).send('Ocorreu um erro ao cadastrar: ' + err.message);
    } else if (body.status == 'ERROR') {
      res.status(422).send(body.message);
    } else if (!body.nome) {
      res.status(422).send('Ocorreu um erro ao validar o CNPJ');
    } else {
      newProducer.name = body.fantasia
      if (!newProducer.name) {
        newProducer.name = body.nome
      }
      newProducer.slug = slugify(newProducer.name).toLowerCase()
      newProducer.corporate_name = body.nome
      if (body.atividade_principal && body.atividade_principal.length) {
        newProducer.description = body.atividade_principal[0].text
      }
      newProducer.address = {
        uf: body.uf,
        city: body.municipio,
        postal_code: body.cep,
        address: [body.logradouro, body.numero, body.bairro].join(', ')
      }
      if (body.email) {
        newProducer.email = body.email
      }
      if (body.telefone) {
        newProducer.phones = body.telefone.split(' / ')
      }
      newProducer.contact_persons = []
      if (body.qsa && body.qsa.length) {
        body.qsa.forEach(contact_person => {
            newProducer.contact_persons.push({
              name: contact_person.nome,
              position: contact_person.qual.split('-')[1]
            })
        })
      }

      newProducer.legal_format = body.natureza_juridica
      newProducer.tax_regime = body.porte
      newProducer.subscription = body.abertura
      newProducer.save(function(err, producer) {
        if (err) {
          if (err.message.includes('duplicate')) {
            res.status(422).send('Este produtor já está cadastrado');
          } else {
            res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
          }
        } else {
          res.send(producer);
        }
      });
    }
  });

});

router.put('/:id', auth.manager, function(req, res) {
  var params = req.body
  User.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: params
  }, {
    upsert: true
  }, function(err, newProducer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message);
    } else {
      res.send(newProducer);
    }
  });
});

router.delete('/:id', auth.manager, function(req, res) {
  User.findOne({
    _id: req.params.id
  }).populate('products').exec(function(err, producer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      if (producer.products && producer.products.length) {
        res.status(422).send('Não é possível excluír! Existem produtos cadastrados para este produtor');
      } else {
        producer.remove();
        res.send(producer);
      }
    }
  })

});

module.exports = router;
