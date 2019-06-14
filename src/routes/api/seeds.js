var express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    auth = require('../auth'),
    Seed = mongoose.model('Seed');

router.get('/', auth.required, function(req, res){
    Seed.find({}).exec(function(err, seeds){
        if(err) {
            res.status(422).send('Ocorreu um erro ao carregar a lista: '+err);
        } else {
            res.json(seeds);
        }
    });
});

router.get('/:id', auth.required, function(req, res){
    Seed.findOne({
        _id: req.params.id
    }).exec(function(err, seed){
        if(err) {
            res.status(422).send('Ocorreu um erro ao carregar o item: '+err);
        } else {
            res.json(seed);
        }
    });
});

router.post('/', auth.required, function(req, res){
    var newSeed = new Seed(req.body);
    newSeed.save(function(err, seed){
        if(err) {
            res.status(422).send('Ocorreu um erro ao salvar: '+err);
        } else {
            res.send(seed);
        }
    });
});

router.put('/:id', auth.required, function(req, res){
    Seed.findOneAndUpdate({
        _id: req.params.id
    },{
        $set: req.body
    },{
        upsert: true
    },function(err, newSeed){
        if(err) {
            res.status(422).send('Ocorreu um erro ao atualizar: '+err);
        } else {
            res.send(newSeed);
        }
    });
});

router.delete('/:id', auth.required, function(req, res){
    Seed.findByIdAndRemove({
        _id: req.params.id
    },function(err, seed){
        if(err) {
            res.status(422).send('Ocorreu um erro ao excluír: '+err);
        } else {
            res.send(seed);
        }
    });
});

module.exports = router;
