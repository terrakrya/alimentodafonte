var router = require('express').Router();

router.use('/', require('./users'));
router.use('/seeds', require('./seeds'));
router.use('/collectors_groups', require('./collectors_groups'));
router.use('/seeds_houses', require('./seeds_houses'));
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
