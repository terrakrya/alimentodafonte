var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

router.get('/users', auth.required, function(req, res){
    var filters = {}
    if (req.query.role && req.query.role != 'user') {
      filters = { roles: req.query.role}
    }
    console.log(req.query.role);
    console.log(filters);
    User.find(filters).exec(function(err, seeds){
        if(err) {
            res.status(422).send('Ocorreu um erro ao carregar a lista: '+err);
        } else {
            res.json(seeds);
        }
    });
});

router.get('/users/:id', auth.required, function(req, res, next){
  User.findById(req.params.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json(user);
  }).catch(next);
});

router.get('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json(user);
  }).catch(next);
});

router.put('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.username !== 'undefined'){
      user.username = req.body.username;
    }
    if(typeof req.body.email !== 'undefined'){
      user.email = req.body.email;
    }
    if(typeof req.body.bio !== 'undefined'){
      user.bio = req.body.bio;
    }
    if(typeof req.body.image !== 'undefined'){
      user.image = req.body.image;
    }
    if(typeof req.body.password !== 'undefined'){
      user.setPassword(req.body.password);
    }

    return user.save().then(function(){
      return res.json(user.toAuthJSON());
    });
  }).catch(next);
});

router.post('/users/login', function(req, res, next){
  if(!req.body.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json(user.toAuthJSON());
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/users', auth.required, function(req, res, next){
  var user = new User();

  user.username = req.body.username
  user.email = req.body.email
  user.name = req.body.name
  user.nickname = req.body.nickname
  user.cpf = req.body.cpf
  user.contact = req.body.contact
  user.image = req.body.image
  user.address = req.body.address
  user.bank_account = req.body.bank_account

  if (req.payload.roles.includes('admin')) {
    user.roles = req.body.roles
  } else {
    user.roles = req.body.roles.filter(value => { value == 'admin' })
  }

  user.setPassword(req.body.password);

  user.save().then(function(){
    return res.send(user);
  }).catch(next);
});

router.put('/users/:id', auth.required, function(req, res, next){
  User.findById(req.params.id).then(function(user){

    user.username = req.body.username
    user.email = req.body.email
    user.name = req.body.name
    user.nickname = req.body.nickname
    user.cpf = req.body.cpf
    user.contact = req.body.contact
    user.image = req.body.image
    user.address = req.body.address
    user.bank_account = req.body.bank_account

    if (req.payload.roles.includes('admin')) {
      user.roles = req.body.roles
    }

    if (req.body.password) {
      user.setPassword(req.body.password);
    }

    user.save().then(function(){
      return res.send(user);
    }).catch(next);
  })
});

router.delete('/users/:id', auth.required, function(req, res){
    User.findByIdAndRemove({
        _id: req.params.id
    },function(err, user){
        if(err) {
            res.status(422).send('Ocorreu um erro ao excluír: '+err);
        } else {
            res.send(user);
        }
    });
});

module.exports = router;
