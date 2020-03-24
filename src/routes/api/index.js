var router = require('express').Router();

router.use('/', require('./users'));
router.use('/organizations', require('./organizations'));
router.use('/suppliers', require('./suppliers'));
router.use('/products', require('./products'));
router.use('/product_variations', require('./product_variations'));
router.use('/offers', require('./offers'));
router.use('/orders', require('./orders'));
router.use('/uploads', require('./uploads'));
router.use('/shop', require('./shop'));
router.use('/msg-service', require('../../msg-service/router'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
