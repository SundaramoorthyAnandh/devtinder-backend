const express = require('express');
const connect2Db = require('./config/db');
const user = require('./models/user');
require('./config/db');

const app = express();

// Middleware to parse JSON body which converts JSON to JS object
app.use(express.json());

// POST request to create a new user
app.post('/api/v1/signup', async (req, res) => {
  const newUser = new user(req.body);

  try {
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    res.status(400).send('Error pushing data to database ::' + error.message);
  }
});

// GET request to fetch all users
app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json({
      message: 'Users fetched successfully',
      users: users,
    });
  } catch (error) {
    res.status(400).send('Error fetching users');
  }
});

// GET request to fetch specific user
app.get('/api/v1/user/:id', async (req, res) => {
  try {
    const foundUser = await user.findById(req.params.id);
    res.status(200).json({
      message: 'User fetched successfully',
      user: foundUser,
    });
  } catch (error) {
    res.status(400).send('Error fetching users');
    console.log(error.message);
  }
});

// PATCH request to update a user's data
app.patch('/api/v1/user', async (req, res) => {
  try {
    const updatedUser = await user.findByIdAndUpdate(
      req.body.userId,
      req.body,
      {
        // returns updated document
        returnDocument: 'after',
        // runs validation on update. By default, validations wont run on update but on initial save
        runValidators: true,
      }
    );
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).send('Error updating users');
    console.log(error.message);
  }
});

// DEL request to delete a user data
app.delete('/api/v1/user', async (req, res) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.body.userId);
    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    res.status(400).send('Error deleting users');
    console.log(error.message);
  }
});

connect2Db()
  .then(() => {
    console.log('Connected to DB successfully');

    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((err) => console.error(err));
