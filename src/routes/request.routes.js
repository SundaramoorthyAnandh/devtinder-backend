const express = require('express');
const { userAuth } = require('../../middlewares/auth');
const User = require('../models/user.models');
const validate = require('validator');

const requestRouter = express.Router();

requestRouter.use(userAuth);

requestRouter.post('/api/v1/swipe/right', async (req, res) => {
  try {
    // logic for sending connection req
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

requestRouter.post('/api/v1/swipe/left', async (req, res) => {
  try {
    // logic for adding user to ignore list
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

requestRouter.post('/api/v1/request/accept', async (req, res) => {
  try {
    // logic for accepting others request
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

requestRouter.post('/api/v1/request/reject', async (req, res) => {
  try {
    // logic for rejecting others request
  } catch (error) {
    res.status(400).send('Error ::' + error.message);
  }
});

module.exports = requestRouter;
