var router = require('express').Router();

router.use('/', require('./users'));
router.use('/organizations', require('./organizations'));
router.use('/suppliers', require('./suppliers'));
router.use('/products', require('./products'));
router.use('/product_variations', require('./product_variations'));

router.use('/seeds', require('./seeds'));
router.use('/collectors_groups', require('./collectors_groups'));
router.use('/seeds_houses', require('./seeds_houses'));
router.use('/collection_areas', require('./collection_areas'));
router.use('/seeds_matrixes', require('./seeds_matrixes'));
router.use('/potential_lists', require('./potential_lists'));
router.use('/collectors_requests', require('./collectors_requests'));
router.use('/orders', require('./orders'));
router.use('/collections', require('./collections'));
router.use('/lots', require('./lots'));
router.use('/stock_in', require('./stock_in'));
router.use('/stock_out', require('./stock_out'));
router.use('/stock', require('./stock'));
router.use('/collector', require('./collector'));
router.use('/uploads', require('./uploads'));

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
