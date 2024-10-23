const express = require('express');
const {
    validateSignupData,
    sanitizeSignupData,
    encryptPassword,
} = require('../utils/signup');
const User = require('../models/user.models');
const validate = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const process = require('node:process');
const { updatePreferences } = require('./profile.routes');
const { USER_SAFE_FIELDS } = require('../utils/constants');

const authRouter = express.Router();

// POST request to create a new user
authRouter.post('/api/v1/signup', async (req, res) => {
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

        const savedUser = await newUser.save();

        // create preferences once user is created
        const prefs = await updatePreferences(savedUser._id);

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
            prefs,
        });
    } catch (error) {
        res.status(400).send(
            'Error pushing data to database ::' + error.message
        );
    }
});

authRouter.post('/api/v1/login', async (req, res) => {
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
                process.env.JWT_SECRET, // secret
                {
                    expiresIn: '1d',
                }
            );

            const data = {};

            for (const key in registeredDbUser) {
                if (USER_SAFE_FIELDS.includes(key)) {
                    data[key] = registeredDbUser[key];
                }
            }

            res.cookie('authToken', authToken, {
                maxAge: 1 * 24 * 60 * 60 * 1000, // 24 hrs
            }).json({
                message: 'Login Successful',
                data,
            });
        } else {
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
        res.status(400).send('Issue while logging in ::' + error.message);
    }
});

module.exports = authRouter;
