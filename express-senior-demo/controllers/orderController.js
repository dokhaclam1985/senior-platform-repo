const orderService = require('../services/orderService');

async function createOrder(req, res, next) {
  try {
    const { customerName, items } = req.body;

    const result = await orderService.createOrder(
      customerName,
      items
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
};