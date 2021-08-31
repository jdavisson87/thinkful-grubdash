const router = require('express').Router();
const controller = require('./dishes.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

router.route('/:dishId').all(methodNotAllowed);

router.route('/').all(methodNotAllowed);

module.exports = router;
