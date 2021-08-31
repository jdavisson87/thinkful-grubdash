const path = require('path');
const dishes = require(path.resolve('src/data/dishes-data'));
const nextId = require('../utils/nextId');

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res) {
  const { dishId } = req.params;
  const byId = dishId ? (dish) => dish.id === dishId : () => true;
  res.json({ data: dishes.filter(byId) });
}

module.exports = {
  list,
};
