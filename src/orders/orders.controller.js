const path = require('path');
const orders = require(path.resolve('src/data/orders-data'));
const nextId = require('../utils/nextId');

const list = (req, res) => {
  res.json({ data: orders });
};

module.exports = {
  list,
};
