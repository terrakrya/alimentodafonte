var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  select = require('../utils').select,
  populate = require('../utils').populate,
  ProductVariation = mongoose.model('ProductVariation'),
  Offer = mongoose.model('Offer'),
  Order = mongoose.model('Order'),
  OrderItem = mongoose.model('OrderItem');

router.get('/offers', function(req, res) {
  var query = {}
  Offer.find(query, select(req)).populate(populate(req)).exec(function(err, offers) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(offers);
    }
  });
});

router.get('/tags', function(req, res) {
  var query = {}
  ProductVariation.find(query, 'tags').exec(function(err, resp) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      var tags = {}
      resp.forEach(tag_list => {
        tag_list.tags.forEach(tag => {
          tags[tag.text] = true
        })
      })
      res.json(Object.keys(tags));
    }
  });
});

router.get('/offer/:id', function(req, res) {
  Offer.findOne({
    _id: req.params.id
  }).populate(populate(req)).exec(function(err, offer) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message);
    } else {
      res.json(offer);
    }
  });
});


router.post('/order', auth.client, function(req, res) {
  console.log(req.body);
  var newOrder = new Order({
    client: req.payload.id
  });

  newOrder.save(async function(err, order) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
    } else {
      for (const item of req.body) {
        var newOrderItem = new OrderItem({
          order: order._id,
          offer: item.offer._id,
          qtd: item.qtd,
          price: item.offer.final_price,
          total: item.qtd * item.offer.final_price,
        });

        await newOrderItem.save();
      }
      res.send(order);
    }
  });
});


module.exports = router;
