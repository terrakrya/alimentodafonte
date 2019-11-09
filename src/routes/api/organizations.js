var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  slugify = require('slugify')
auth = require('../auth'),
  populate = require('../utils').populate,
  request = require('request'),
  Organization = mongoose.model('Organization');

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
  var newOrganization = new Organization(req.body);
  newOrganization.cnpj = newOrganization.cnpj.replace(/\D/g, '')

  request('https://www.receitaws.com.br/v1/cnpj/' + newOrganization.cnpj, {
    json: true
  }, (err, resp, body) => {
    if (err) {
      res.status(422).send('Ocorreu um erro ao cadastrar: ' + err.message);
    } else {
      newOrganization.slug = slugify(body.fantasia).toLowerCase()
      newOrganization.name = body.fantasia
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
              position: contact_person.qual
            })
        })
      }

      newOrganization.legal_format = body.natureza_juridica
      newOrganization.legal_format = body.natureza_juridica
      newOrganization.tax_regime = body.porte
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      console.log(newOrganization);
      newOrganization.save(function(err, organization) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          res.send(organization);
        }
      });
    }
  });

});

router.put('/:id', auth.manager, function(req, res) {
  params = req.body
  params.slug = slugify(params.name).toLowerCase()
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
  }).populate('').exec(function(err, collectors_group) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      // if (collectors_group.collections && collectors_group.collections.length) {
      //   res.status(422).send('Não é possível excluír! Existem coletas cadastradas para este grupo');
      // } else if (collectors_group.collection_areas && collectors_group.collection_areas.length) {
      //   res.status(422).send('Não é possível excluír! Existem áreas de coleta cadastradas para este grupo');
      // } else if (collectors_group.stock_ins && collectors_group.stock_ins.length) {
      //   res.status(422).send('Não é possível excluír! Existem entradas no estoque cadastradas para este grupo');
      // } else if (collectors_group.collectors_requests && collectors_group.collectors_requests.length) {
      //   res.status(422).send('Não é possível excluír! Existem pedidos para coletores cadastrados para este grupo: ('+collectors_group.collectors_requests.map(c => 'Pedido '+ c.code).join(', ') +')');
      // } else if (collectors_group.potential_lists && collectors_group.potential_lists.length) {
      //   res.status(422).send('Não é possível excluír! Existem listas de potencial cadastradas para este grupo: ('+collectors_group.potential_lists.map(p => 'Lista '+ p.code).join(', ') +')');
      // } else if (collectors_group.seeds_matrixes && collectors_group.seeds_matrixes.length) {
      //   res.status(422).send('Não é possível excluír! Existem matrixes de semente relacionadas a este grupo');
      // } else if (collectors_group.seeds_houses && collectors_group.seeds_houses.length) {
      //   res.status(422).send('Não é possível excluír! Existem grupos de coletores relacionados a este grupo: ('+collectors_group.seeds_houses.map(p => p.name).join(', ') +')');
      // } else {
      collectors_group.remove();
      res.send(collectors_group);
      // }
    }
  })

});

module.exports = router;
