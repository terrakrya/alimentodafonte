var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  auth = require('../auth'),
  select = require('../utils').select,
  populate = require('../utils').populate,
  ProductVariation = mongoose.model('ProductVariation'),
  Offer = mongoose.model('Offer'),
  Order = mongoose.model('Order');

router.get('/offers', function(req, res) {
  var query = {}
  Offer.find(query, select(req)).populate(populate(req)).exec(function(err, offers) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      offers = offers.filter(offer => {
        return (offer.qtd - offer.qtd_ordered) > 0
      })
      res.json(offers);
    }
  });
});

router.get('/tags', function(req, res) {
  var query = {}
  Offer.find(query, 'product_variation').populate('product_variation', 'tags').exec(function(err, resp) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      console.log(resp);
      var tags = {}
      resp.forEach(tag_list => {
        tag_list.product_variation.tags.forEach(tag => {
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

router.get('/orders', auth.client, function(req, res) {
  var query = {
    client: req.payload.id
  }
  Order.find(query, select(req)).populate(populate(req)).exec(function(err, orders) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(orders);
    }
  });
});

router.get('/order/:id', auth.client, function(req, res) {
  var query = {
    _id: req.params.id,
    client: req.payload.id
  }
  Order.findOne(query, select(req)).populate({
    path: 'items.offer',
    model: 'Offer',
    populate: [{
      path: 'product',
      model: 'Product'
    }, {
      path: 'product_variation',
      model: 'ProductVariation'
    }, {
      path: 'supplier',
      model: 'Supplier'
    }]
  }).exec(function(err, order) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err.message);
    } else {
      res.json(order);
    }
  });
});

router.post('/order', auth.client, function(req, res) {
  console.log(req.body.cart);

  Order.find().sort({
    code: -1
  }).limit(1).exec(function(err, latest) {
    if (!err) {
      var newOrder = new Order({
        client: req.payload.id,
        items: [],
        status: 'created',
        name: req.body.name,
        email: req.body.email,
        cnpj: req.body.cnpj,
        phone: req.body.phone,
        address: req.body.address,
      });

      if (latest && latest.length) {
        newOrder.code = latest[0].code + 1
      } else {
        newOrder.code = 1
      }

      req.body.cart.forEach(item => {
        newOrder.items.push({
          offer: item.offer._id,
          qtd: item.qtd,
          price: item.offer.final_price,
          total: item.qtd * item.offer.final_price,
          status: 'created',
        })
      })

      newOrder.save(function(err, order) {
        if (err) {
          res.status(422).send('Ocorreu um erro ao salvar: ' + err.message);
        } else {
          updateQtdOrdered(order.items)
          console.log('order._id');
          console.log(order._id);
          res.send(order);
        }
      });
    }
  })
});

var updateQtdOrdered = (order_items) => {
  order_items.forEach(item => {
    Offer.findOne({_id: item.offer}).exec(function(err, offer) {
      console.log('items.offer');
      console.log(offer._id);
      Order.find({ "items.offer": offer._id }).exec(function(err, orders) {
        console.log('orders');
        console.log(orders);
        var items_qtd = 0
        orders.forEach(o => {

          o.items.forEach(i => {
            if (String(i.offer) == String(offer._id)) {
              items_qtd += i.qtd
            }
          })
          console.log(items_qtd);
        })

        console.log('items_qtd');
        console.log(items_qtd);
        offer.qtd_ordered = items_qtd
        offer.save()
      });
    });
  })
}
module.exports = router;
