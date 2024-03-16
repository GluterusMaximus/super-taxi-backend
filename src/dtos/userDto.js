export default class UserDto {
  id
  name
  email
  role

  constructor(model) {
    this.id = model._id
    this.name = model.name
    this.email = model.email
    this.role = model.role
  }
}
