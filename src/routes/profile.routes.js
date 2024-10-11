const express = require('express');
const { userAuth } = require('../../middlewares/auth');
const User = require('../models/user.models');

const profileRouter = express.Router();

profileRouter.use(userAuth);

profileRouter.get('/api/v1/profile', async (req, res) => {
  try {
    if (req._id) {
      const profileInfo = await User.findOne({ _id: req._id });
      res.status(200).send(profileInfo);
    } else {
      throw new Error('User unauthorized');
    }
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

profileRouter.patch('/api/v1/profile/edit', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      req.body,
      {
        // returns updated document
        returnDocument: 'after',
        // runs validation on update.
        //By default, validations wont run on update but on initial save
        runValidators: true,
      }
    );
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).send('Error updating users');
  }
});

profileRouter.get('/api/v1/preferences', async (req, res) => {
  try {
    // preferences logic
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

profileRouter.patch('/api/v1/preferences/edit', async (req, res) => {
  try {
    // preferences edit logic
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

profileRouter.delete(
  '/api/v1/profile/deactivate',
  userAuth,
  async (req, res) => {
    try {
      // deactivate user logic
    } catch (error) {
      res.status(400).send('Error ::' + error.message);
    }
  }
);

module.exports = profileRouter;
