const router = require('express').Router();
const controller = require('./orders.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

router.route('/:orderId').all(methodNotAllowed);

router.route('/').all(methodNotAllowed);

module.exports = router;
