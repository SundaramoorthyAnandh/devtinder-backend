const express = require('express');
const connect2Db = require('./config/db');
const User = require('./models/user');
const validate = require('validator');
const {
  validateSignupData,
  sanitizeSignupData,
  encryptPassword,
} = require('./utils/signup');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');
require('./config/db');

const app = express();

// Middleware to parse JSON body which converts JSON to JS object
// Chaining cookie parser
app.use([express.json(), cookieParser()]);

// POST request to create a new user
app.post('/api/v1/signup', async (req, res) => {
  let signupData = req.body;

  try {
    // validate signup data
    validateSignupData(signupData);

    // removes unwanted fields
    signupData = sanitizeSignupData(signupData);

    // encrypt password before saving to DB
    signupData.password = await encryptPassword(signupData.password);

    // creating instance of a User data
    const newUser = new User(signupData);

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    res.status(400).send('Error pushing data to database ::' + error.message);
  }
});

app.post('/api/v1/login', async (req, res) => {
  try {
    const { email, password: userEnteredPassword } = req.body;

    // check for invalid email
    if (!validate.isEmail(email)) {
      throw new Error('Enter a valid email address');
    }

    // check for user in DB
    const registeredDbUser = await User.findOne({ email });

    if (!registeredDbUser) {
      throw new Error('Invalid Credentials');
    }

    // check for password match
    const allowLogin = await bcrypt.compare(
      userEnteredPassword,
      registeredDbUser.password
    );

    if (allowLogin) {
      const authToken = jwt.sign(
        { _id: registeredDbUser._id },
        'SAJTSK@959924', // secret
        {
          expiresIn: '1d',
        }
      );

      res
        .cookie('authToken', authToken, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
        })
        .send('Login Successful');
    } else {
      throw new Error('Invalid Credentials');
    }
  } catch (error) {
    res.status(400).send('Issue while logging in ::' + error.message);
  }
});

app.get('/api/v1/profile', userAuth, async (req, res) => {
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

// GET request to fetch specific user - Search a user
app.get('/api/v1/user/:id', async (req, res) => {
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
    res.status(400).send('Error fetching user ::' + error.message);
  }
});

// PATCH request to update a user's data
app.patch('/api/v1/user', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
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
  }
});

// DEL request to delete a user data
app.delete('/api/v1/user', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.body.userId);
    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    res.status(400).send('Error deleting users');
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
