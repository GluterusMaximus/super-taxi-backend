export default class OrderDto {
  id
  orderItems
  shippingAddress
  shippingPrice
  taxPrice
  totalPrice

  constructor(model) {
    this.id = model._id
    this.orderItems = model.orderItems
    this.shippingAddress = model.shippingAddress
    this.shippingPrice = model.shippingPrice
    this.taxPrice = model.taxPrice
    this.totalPrice = model.totalPrice
  }
}
