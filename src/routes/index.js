var router = require('express').Router();

router.use('/api', require('./api'));

router.get('/.well-known/acme-challenge/343fzCmsCO3gOFr2HVxRwtbQLxliZLEpsgiyY3p-oIc', function(req, res) {
  res.send('343fzCmsCO3gOFr2HVxRwtbQLxliZLEpsgiyY3p-oIc.0XMFlq6Y8YnP-dipKWnStwpqYcDSozaJeVDIUUqOAV0');
});

module.exports = router;
