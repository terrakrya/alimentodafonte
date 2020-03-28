var jwt = require('express-jwt');
var secret = require('../config').secret;

function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

function isManager(req) {
  if (req.payload && req.payload.roles) {
    var roles = req.payload.roles
    return roles && (roles.includes('manager') || roles.includes('link') || roles.includes('admin'))
  }
  return false
}

function isLink(req) {
  if (req.payload && req.payload.roles) {
    var roles = req.payload.roles
    return roles && (roles.includes('link') || roles.includes('admin'))
  }
  return false
}

function isProducer(req) {
  if (req.payload && req.payload.roles) {
    var roles = req.payload.roles
    console.log('roles');
    console.log(roles);
    return roles && (roles.includes('producer') || roles.includes('admin'))
  }
  return false
}

function isClient(req) {
  if (req.payload && req.payload.roles) {
    var roles = req.payload.roles
    return roles && (roles.includes('client'))
  }
  return false
}


function authenticatedManager(req, res, next) {
  if (isManager(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message: 'A permissão de gestor, elo ou administrador é necessária para acessar este recurso.'
    })
  }
}

function authenticatedLink(req, res, next) {
  if (isLink(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message: 'A permissão de elo ou administrador é necessária para acessar este recurso.'
    })
  }
}

function authenticatedProducer(req, res, next) {
  if (isProducer(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message: 'A permissão de produtor ou administrador é necessária para acessar este recurso.'
    })
  }
}

function authenticatedClient(req, res, next) {
  if (isClient(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message: 'A permissão de cliente é necessária para acessar este recurso.'
    })
  }
}

var auth = {
  authenticated: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  manager: [jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }), authenticatedManager],
  link: [jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }), authenticatedLink],
  producer: [jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }), authenticatedProducer],
  client: [jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }), authenticatedClient],
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  }),
  isLink: isLink,
  isManager: isManager,
  isProducer: isProducer,
  isClient: isClient
};

module.exports = auth;
