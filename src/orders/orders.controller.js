const path = require('path');
const orders = require(path.resolve('src/data/orders-data'));
const nextId = require('../utils/nextId');

const idMatchesId = (req, res, next) => {
  const { orderId } = req.params;
  const order = req.body.data;
  if (order.id && order.id !== orderId) {
    return next({
      status: 400,
      message: `Data id does not match order id. Order: ${orderId} Data: ${order.id}`,
    });
  }
  next();
};

const statusIsValid = (req, res, next) => {
  const order = req.body.data;
  if (!order.status) {
    return next({
      status: 400,
      message: `status is missing`,
    });
  }

  if (order.status === 'invalid') {
    return next({
      status: 400,
      message: `status is invalid`,
    });
  }

  if (order.status === 'delivered') {
    return next({
      status: 400,
      message: 'Cannot updated a delivered order',
    });
  }
  next();
};

const orderIdIsValid = (req, res, next) => {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder === undefined) {
    next({
      status: 404,
      message: `The order Id does not exist: ${orderId}`,
    });
  }
  res.locals.foundOrder = foundOrder;
  next();
};

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

const update = (req, res, next) => {
  const { newOrder, foundOrder } = res.locals;
  if (newOrder.id !== foundOrder.id) {
    return next({
      status: 400,
      message: `You cannot change existing order Id ${foundOrder.id} to ${newOrder.id}`,
    });
  }

  const updatedOrder = { ...foundOrder, ...newOrder };
  orders.push(updatedOrder);
  res.json({ data: updatedOrder });
};

const read = (req, res, next) => {
  res.json({ data: res.locals.foundOrder });
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
  read: [orderIdIsValid, read],
  update: [orderIdIsValid, idMatchesId, bodyIsValid, statusIsValid, update],
  list,
};
