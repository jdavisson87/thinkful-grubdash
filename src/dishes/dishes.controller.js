const path = require('path');
const dishes = require(path.resolve('src/data/dishes-data'));
const nextId = require('../utils/nextId');

// TODO: Implement the /dishes handlers needed to make the tests pass

const bodyIsValid = (req, res, next) => {
  const {
    data: { name, description, price, image_url },
  } = req.body;
  if (!name) {
    next({
      status: 400,
      message: `A 'name' property is required`,
    });
  }
  if (!description) {
    next({
      status: 400,
      message: `A 'description' property is required`,
    });
  }
  if (!price || price < 0) {
    next({
      status: 400,
      message: `A 'price' property is required`,
    });
  }
  if (!image_url) {
    next({
      status: 400,
      message: `An 'image_url' property is required`,
    });
  }
  next();
};

const create = (req, res) => {
  const {
    data: { name, description, price, image_url },
  } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};

const list = (req, res) => {
  const { dishId } = req.params;
  const byId = dishId ? (dish) => dish.id === dishId : () => true;
  res.json({ data: dishes.filter(byId) });
};

module.exports = {
  create: [bodyIsValid, create],
  list,
};
