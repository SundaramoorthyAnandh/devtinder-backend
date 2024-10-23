const express = require('express');
const { userAuth } = require('../../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest.models');
const { USER_SAFE_FIELDS } = require('../utils/constants');

const userRouter = express.Router();

userRouter.use(userAuth);

// GET list of all the pending connection requests
userRouter.get('/api/v1/user/requests/received', async (req, res) => {
    try {
        const toUserId = req._id;

        const connectionRequests = await ConnectionRequest.find(
            {
                toUserId,
                status: 'interested',
            },
            {
                // Limit fields of a document aka Projections
                // can be an object with sort value, 1 as ASC & -1 as DESC
                fromUserId: 1,
                updatedAt: -1,
            }
            // Or string 'fromUserId updatedAt' defaulting both fields as ASC
        ).populate('fromUserId', USER_SAFE_FIELDS);
        // first arg - populating the ref of fromUserId from Users collection
        // second arg - limit fields of User schema - can be an array or string with fields separated with space

        if (!connectionRequests) {
            throw new Error('Problem while fetching your connection requests');
        }

        return res.status(200).json({
            data: connectionRequests,
        });
    } catch (error) {
        res.status(400).send('Error :: ' + error.message);
    }
});

// GET list of all the matched users
userRouter.get('/api/v1/user/matches', async (req, res) => {
    try {
        const loggedInUserId = req._id;

        // matches are either you sent req or some one send you req
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUserId,
                },
                {
                    toUserId: loggedInUserId,
                },
            ],
            status: 'accepted',
        })
            .populate('fromUserId', USER_SAFE_FIELDS)
            .populate('toUserId', USER_SAFE_FIELDS);

        if (!connectionRequests) {
            throw new Error('Problem while fetching your connection requests');
        }

        // if logged in user is either 'from user' or 'to user',
        // removing that and send only other person details
        const matchedUsers = connectionRequests.map(
            ({ fromUserId, toUserId }) => {
                if (loggedInUserId.toString() === fromUserId._id.toString()) {
                    return toUserId;
                }
                return fromUserId;
            }
        );

        return res.status(200).json({
            data: matchedUsers,
        });
    } catch (error) {
        res.status(400).send('Error :: ' + error.message);
    }
});

module.exports = userRouter;
