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
    return roles && (roles.includes('manager') || roles.includes('admin'))
  }
  return false
}

function isCollector(req) {
  if (req.payload && req.payload.roles) {
    var roles = req.payload.roles
    return roles && (roles.includes('collector') || roles.includes('manager') || roles.includes('admin'))
  }
  return false
}

function authenticatedManager(req, res, next) {
  if (isManager(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message: 'A permissão de gestor ou administrador é necessária para acessar este recurso.'
    })
  }
}

function authenticatedCollector(req, res, next) {
  if (isCollector(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message: 'A permissão de coletor, gestor ou administrador é necessária para acessar este recurso.'
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
  collector: [jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }), authenticatedCollector],
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  }),
  isCollector: isCollector,
  isManager: isManager
};

module.exports = auth;
