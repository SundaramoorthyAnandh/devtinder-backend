const express = require('express');
const { userAuth } = require('../../middlewares/auth');
const User = require('../models/user.models');
const Preferences = require('../models/preferences.models');
const { preferencesValidator } = require('../utils/preferencesValidation');
const validator = require('validator');

const profileRouter = express.Router();

profileRouter.use(userAuth);

profileRouter.get('/api/v1/profile', async (req, res) => {
    try {
        if (req._id) {
            const profileInfo = await User.findById(req._id);
            res.status(200).send(profileInfo);
        } else {
            throw new Error('User unauthorized');
        }
    } catch (error) {
        res.status(400).send('Error ::' + error.message);
    }
});

profileRouter.patch('/api/v1/profile/edit', userAuth, async (req, res) => {
    try {
        // findByIdAndUpdate(id, update, options)
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

profileRouter.post(
    '/api/v1/user/preferences/edit',
    userAuth,
    async (req, res) => {
        try {
            // preferences logic
            const validData = preferencesValidator(req.body);
            console.log(validData);

            if (validator.isMongoId(req._id)) {
                const updatedPrefs = await updatePreferences(req._id, req.body);

                return res.status(201).json({
                    message: 'Preferences added successfully',
                    preferences: updatedPrefs,
                });
            } else {
                throw new Error('Cannot add preferences of an invalid User Id');
            }
        } catch (error) {
            res.status(400).send('Error ::' + error.message);
        }
    }
);

profileRouter.get('/api/v1/user/preferences/view', async (req, res) => {
    try {
        const preferences = await Preferences.findById(req._id);

        if (!preferences) {
            throw new Error('Cannot fetch Preferences');
        }

        res.status(200).json({
            message: 'fetched preferences sucessfully',
            data: preferences,
        });
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

const updatePreferences = async (userId, modifiedPrefs = {}) => {
    console.log('updatePreferences ::', updatePreferences);
    try {
        const prefs = await Preferences.findByIdAndUpdate(
            userId,
            {
                _id: userId,
                ...modifiedPrefs,
            },
            {
                upsert: true, // insert if not found
                returnDocument: 'after',
            }
        );

        return prefs;
    } catch (error) {
        throw new Error('Error while updating preferences', error);
    }
};

module.exports = { profileRouter, updatePreferences };
