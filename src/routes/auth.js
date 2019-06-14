var jwt = require('express-jwt');
var secret = require('../config').secret;

function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

function isManager(req, res, next) {
  if (req.payload && req.payload.roles) {
    var roles = req.payload.roles
    if (roles.includes('admin') || roles.includes('manager')) {
      next()
    } else {
      return res.status(403).json({
        status: 403,
        message: 'A permissão de gestor é necessária para acessar este recurso.'
      })
    }
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
  }), isManager],
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
