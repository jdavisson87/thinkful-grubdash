const path = require('path');
const orders = require(path.resolve('src/data/orders-data'));
const nextId = require('../utils/nextId');

const bodyIsValid = (req, res, next) => {
  const order = req.body.data;
  const { orderId } = req.params;
  const { id, deliverTo, mobileNumber, dishes } = order;

  if (!deliverTo) {
    next({
      status: 400,
      message: `Need valid 'deliverTo'`,
    });
  }

  if (!mobileNumber) {
    next({
      status: 400,
      message: `${mobileNumber} is not a valid mobileNumber`,
    });
  }

  if (!dishes) {
    next({
      status: 400,
      message: `There are no dishes in this order`,
    });
  }

  if (!Array.isArray(dishes) || dishes.length === 0) {
    next({
      status: 400,
      message: `There are no dishes in this order`,
    });
  }

  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    if (
      !dish.quantity ||
      !Number.isInteger(dish.quantity) ||
      !dish.quantity > 0
    ) {
      return next({
        status: 400,
        message: `Dish ${i} needs a valid quantity`,
      });
    }
  }

  let handleId =
    order.id === undefined && orderId
      ? { id: orderId }
      : orderId
      ? { id: orderId }
      : { id: nextId() };

  const newOrder = {
    ...order,
    ...handleId,
  };
  res.locals.newOrder = newOrder;
  next();
};

const list = (req, res) => {
  res.json({ data: orders });
};

const create = (req, res, next) => {
  const { newOrder } = res.locals;
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
};

module.exports = {
  create: [bodyIsValid, create],
  list,
};
