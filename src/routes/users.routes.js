const express = require('express');
const { userAuth } = require('../../middlewares/auth');
const User = require('../models/user.models');
const validate = require('validator');

const usersRouter = express.Router();

usersRouter.use(userAuth);

// GET request to fetch all users
usersRouter.get('/api/v1/users/feed', async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: 'Users fetched successfully',
      users: users,
    });
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

// GET request to fetch specific user - Search a user
usersRouter.get('/api/v1/users/search/:id', async (req, res) => {
  try {
    if (!validate.isMongoId(req.params.id)) {
      throw new Error('Invalid user id');
    }

    const foundUser = await User.findById(req.params.id);

    res.status(200).json({
      message: 'User fetched successfully',
      user: foundUser,
    });
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

usersRouter.get('/api/v1/users/matches', async (req, res) => {
  try {
    // logic for list of matches
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

usersRouter.get('/api/v1/users/sentRequests', async (req, res) => {
  try {
    // logic for history of sent requests sent by you to others
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

module.exports = usersRouter;
