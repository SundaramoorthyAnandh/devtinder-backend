const express = require('express');
const { userAuth } = require('../../middlewares/auth');
const User = require('../models/user.models');
const validate = require('validator');
const Preference = require('../models/preferences.models');
const { GENDERS, USER_SAFE_FIELDS } = require('../utils/constants');
const ConnectionRequest = require('../models/connectionRequest.models');

const feedRouter = express.Router();

feedRouter.use(userAuth);

// GET request to fetch all users
feedRouter.get('/api/v1/feed', async (req, res) => {
    try {
        const loggedinUserId = req._id;

        const preferences = await Preference.findOne({
            userId: loggedinUserId,
        });

        const { page = 1, pageSize = 10 } = req.query;

        const offset =
            (parseInt(page) - 1) * (parseInt(pageSize) > 50 ? 50 : pageSize);

        const genderPreferences =
            preferences.gender === 'all' ? GENDERS : [preferences.gender];

        // Feed does not require
        // 1. users you send req,
        // 2. users sent you req,
        // 3. already matched or rejected users
        // 4. Own user data

        // handles condition 1 -> 3
        const hideUsersFromFeedQuery = {
            $or: [{ fromUserId: loggedinUserId }, { toUserId: loggedinUserId }],
        };

        const usersToHide = new Set();

        const connections = await ConnectionRequest.find(
            hideUsersFromFeedQuery,
            'fromUserId toUserId'
        );

        if (!connections) {
            return res.status(400).json({
                message: 'Problem while fetching feed connections',
            });
        }

        connections.forEach((connection) => {
            usersToHide.add(connection.fromUserId.toString());
            usersToHide.add(connection.toUserId.toString());
        });

        console.log(usersToHide);
        const filterQueryBasedOnPreferences = {
            age: {
                $gte: preferences.age,
            },
            skills: {
                $in: preferences.skills,
            },
            gender: {
                $in: genderPreferences,
            },
            _id: {
                $nin: [
                    ...[loggedinUserId], // handles condition 4
                    ...Array.from(usersToHide),
                ],
            },
        };

        const matchedUsersCount = await User.countDocuments(
            filterQueryBasedOnPreferences
        );

        if (matchedUsersCount === 0) {
            return res.status(200).json({
                message: 'No users found according to your preferences',
            });
        }

        const users = await User.find(
            filterQueryBasedOnPreferences,
            USER_SAFE_FIELDS
        )
            .skip(offset)
            .limit(pageSize);

        res.status(200).json({
            message: 'Users fetched successfully',
            data: {
                users: users,
                totalCount: matchedUsersCount,
            },
        });
    } catch (error) {
        res.status(400).send('Error ::' + error.message);
    }
});

// GET request to fetch specific user - Search a user
feedRouter.get('/api/v1/users/search/:id', async (req, res) => {
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

module.exports = feedRouter;
