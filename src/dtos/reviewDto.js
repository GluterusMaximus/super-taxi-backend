export default class ReviewDto {
  id;
  user;
  comment;
  rating;

  constructor(model) {
    this.id = model._id;
    this.user = model.user;
    this.comment = model.comment;
    this.rating = model.rating;
  }
}
