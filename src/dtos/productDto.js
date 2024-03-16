import ReviewDto from './reviewDto.js';

export default class ProductDto {
  id;
  name;
  price;
  description;
  brand;
  category;
  countInStock;
  reviews;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.price = model.price;
    this.description = model.description;
    this.brand = model.brand;
    this.category = model.category;
    this.countInStock = model.countInStock;
    this.reviews = model.reviews.map(review => new ReviewDto(review));
  }
}
