import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';
import { ORDER_NOT_FOUND_MESSAGE } from '../constants/errorConstants.js';
import convertCurrency from '../utils/convertCurrency.js';
import OrderDto from '../dtos/orderDto.js';
import { validationResult } from 'express-validator';

// @desc     Create a new order
// @route    POST /api/orders
// @access   Private
const placeOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid order data', errors: errors.array() };
  }

  const {
    orderItems,
    shippingAddress,
    shippingPrice,
    taxPrice,
    totalPrice,
    currency,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    let convertedShipping, convertedTax, convertedTotal;
    try {
      [convertedShipping, convertedTax, convertedTotal] = await convertCurrency(
        currency,
        [shippingPrice, taxPrice, totalPrice]
      );
    } catch (axiosErr) {
      res.status(axiosErr.response?.status || 500);
      throw new Error(
        `Cannot convert currency: ${axiosErr.response?.data?.error?.message}`
      );
    }

    const createdOrder = await Order.create({
      orderItems,
      user: req.user._id,
      shippingAddress,
      shippingPrice: convertedShipping,
      taxPrice: convertedTax,
      totalPrice: convertedTotal,
    });

    res.status(201).json(new OrderDto(createdOrder));
  }
});

// @desc     Get an order by id
// @route    GET /api/orders/:id
// @access   Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.json(new OrderDto(order));
  } else {
    res.status(404);
    throw new Error(ORDER_NOT_FOUND_MESSAGE);
  }
});

// @desc     Get logged in user orders
// @route    GET /api/orders/myorders
// @access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  const orderDtos = orders.map(order => new OrderDto(order));
  res.json(orderDtos);
});

// @desc     Get all orders
// @route    GET /api/orders
// @access   Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  const orderDtos = orders.map(order => new OrderDto(order));
  res.json(orderDtos);
});

// @desc     Update order by id
// @route    PUT /api/orders/:id
// @access   Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid order data', errors: errors.array() };
  }

  const {
    shippingAddress,
    user,
    orderItems,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.shippingAddress = shippingAddress;
    order.user = user;
    order.orderItems = orderItems;
    order.taxPrice = taxPrice;
    order.shippingPrice = shippingPrice;
    order.totalPrice = totalPrice;

    const updatedOrder = await order.save();
    res.status(201).json(new OrderDto(updatedOrder));
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc     Delete an order
// @route    DELETE /api/orders/:id
// @access   Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found!');
  }
});

export {
  placeOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrder,
  deleteOrder,
};
