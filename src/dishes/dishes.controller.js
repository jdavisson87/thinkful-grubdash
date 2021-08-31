const path = require('path');
const dishes = require(path.resolve('src/data/dishes-data'));
const nextId = require('../utils/nextId');

// TODO: Implement the /dishes handlers needed to make the tests pass

const dishIdIsValid = (req, res, next) => {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish === undefined) {
    next({
      status: 404,
      message: `The dish Id does not exist: ${dishId}`,
    });
  }
  res.locals.foundDish = foundDish;
  next();
};

const bodyIsValid = (req, res, next) => {
  const dish = req.body.data;
  const { dishId } = req.params;
  const { name, description, price, image_url } = dish;

  if (dish.id && dish.id !== dishId) {
    next({
      status: 400,
      message: `Dish id does not match route id.  Dish: ${dish.id} Route: ${dishId}`,
    });
  }
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
  if (!price || price < 0 || !Number.isInteger(price)) {
    next({
      status: 400,
      message: `A valid 'price' property is required`,
    });
  }

  if (!image_url) {
    next({
      status: 400,
      message: `An 'image_url' property is required`,
    });
  }

  let handleId = undefined;
  handleId =
    dish.id === undefined && dishId
      ? { id: dishId }
      : dishId
      ? { id: dishId }
      : { id: nextId() };

  const newDish = {
    ...dish,
    ...handleId,
  };
  res.locals.newDish = newDish;
  next();
};

const read = (req, res) => {
  res.json({ data: res.locals.foundDish });
};

const create = (req, res) => {
  const { newDish } = res.locals;
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};

const list = (req, res) => {
  const { dishId } = req.params;
  const byId = dishId ? (dish) => dish.id === dishId : () => true;
  res.json({ data: dishes.filter(byId) });
};

const update = (req, res) => {
  const { newDish, foundDish } = res.locals;
  if (newDish.id !== foundDish.id) {
    return next({
      status: 400,
      message: `You cannot change existing dish id ${foundDish.id} to ${newDish.id}`,
    });
  }
  const updatedEntry = { ...foundDish, ...newDish };
  res.json({ data: updatedEntry });
};

module.exports = {
  create: [bodyIsValid, create],
  read: [dishIdIsValid, read],
  update: [dishIdIsValid, bodyIsValid, update],
  list,
};
