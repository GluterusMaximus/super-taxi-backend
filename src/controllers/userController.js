import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import { USER_NOT_FOUND_MESSAGE } from '../constants/errorConstants.js'
import UserDto from '../dtos/userDto.js'

// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    const userDto = new UserDto(user)
    res.json({ ...userDto, token: generateToken(user._id) })
  }
  else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc     Register a new user
// @route    POST /api/users
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400)
    throw { message: 'Invalid registration data', errors: errors.array() }
  }

  const { email, name, password, role } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({ name, email, password, role })
  if (user) {
    const userDto = new UserDto(user)
    res.json({ ...userDto, token: generateToken(user._id) })
  }
  else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc     Get user profile
// @route    GET /api/users/profile
// @access   Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    const userDto = new UserDto(user)
    res.json(userDto)
  }
  else {
    res.status(404)
    throw new Error(USER_NOT_FOUND_MESSAGE)
  }
})

// @desc     Update user profile
// @route    PUT /api/users/profile
// @access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400)
    throw { message: 'Invalid update data', errors: errors.array() }
  }

  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password

    const updatedUser = await user.save()

    const userDto = new UserDto(updatedUser)
    res.json({ ...userDto, token: generateToken(updatedUser._id) })
  }
  else {
    res.status(404)
    throw new Error(USER_NOT_FOUND_MESSAGE)
  }
})

// @desc     Get all users
// @route    GET /api/users
// @access   Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  const userDtos = users.map(user => new UserDto(user))
  res.json(userDtos)
})

// @desc     Delete a user
// @route    DELETE /api/users/:id
// @access   Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  }
  else {
    res.status(404)
    throw new Error(USER_NOT_FOUND_MESSAGE)
  }
})

// @desc     Get a user by id
// @route    GET /api/users/:id
// @access   Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    const userDto = new UserDto(user)
    res.json(userDto)
  }
  else {
    res.status(404)
    throw new Error(USER_NOT_FOUND_MESSAGE)
  }
})

// @desc     Update user profile
// @route    PUT /api/users/:id
// @access   Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400)
    throw { message: 'Invalid update data', errors: errors.array() }
  }

  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    const userDto = new UserDto(updatedUser)
    res.json(userDto)
  }
  else {
    res.status(404)
    throw new Error(USER_NOT_FOUND_MESSAGE)
  }
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
