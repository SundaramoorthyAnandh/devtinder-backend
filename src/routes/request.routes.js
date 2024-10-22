const express = require('express');
const { userAuth } = require('../../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest.models');

const requestRouter = express.Router();

requestRouter.use(userAuth);

// POST Interested & Send Connection Request
// POST Ignore a dev
requestRouter.post(
    '/api/v1/swipe/:swipeDirection/:toUserId',
    async (req, res) => {
        try {
            // logic for sending connection req or ignore a dev
            const fromUserId = req._id;
            const toUserId = req.params.toUserId;
            const swipeDirection = req.params.swipeDirection;

            const ALLOWED_ACTIONS = ['right', 'left'];

            // check for correct action
            if (!ALLOWED_ACTIONS.includes(swipeDirection)) {
                throw new Error(`${swipeDirection} is invalid action`);
            }

            // check for toUser present in DB
            const toUser = await ConnectionRequest.find({
                _id: toUserId,
            });

            if (!toUser) {
                throw new Error(`Cannot find the user to send request`);
            }

            if (String(fromUserId) === String(toUserId)) {
                throw new Error(`Invalid operation`);
            }

            // check for connection req already available b/w from and to users
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    {
                        fromUserId,
                        toUserId,
                    },
                    {
                        fromUserId: toUserId,
                        toUserId: fromUserId,
                    },
                ],
            });

            if (existingConnectionRequest) {
                throw new Error(`Connection request already sent`);
            }

            // create connection req instance
            const connectionRequest = ConnectionRequest({
                fromUserId,
                toUserId,
                status: swipeDirection === 'right' ? 'interested' : 'ignored',
            });

            const data = await connectionRequest.save();

            res.status(200).json({
                message:
                    swipeDirection === 'right'
                        ? 'Successfully sent connection request'
                        : 'Ignored the user',
                data,
            });
        } catch (error) {
            res.status(400).send('Error :: ' + error.message);
        }
    }
);

//POST accept or reject your incoming req
requestRouter.post(
    '/api/v1/request/:status/:connectionRequestId',
    async (req, res) => {
        try {
            const { status, connectionRequestId } = req.params;
            const loggedInUserId = req._id;

            const ALLOWED_ACTIONS = ['accepted', 'rejected'];

            // check for allowed actions
            if (!ALLOWED_ACTIONS.includes(status)) {
                throw new Error(`Status not allowed - ${status}`);
            }

            // check connection req id is valid
            // check toUserId is loggedin user id, because other users send request TO the current loggedin user
            // check if status of the request is interested

            const connectionRequest = await ConnectionRequest.findOne({
                _id: connectionRequestId,
                toUserId: loggedInUserId,
                status: 'interested',
            });

            if (!connectionRequest) {
                return res.status(404).json({
                    message: 'Invalid Connection Request',
                });
            }

            // if connection req exist, change status to accepted
            connectionRequest.status = 'accepted';

            const data = await connectionRequest.save();

            res.status(200).json({
                message: 'Accepted the request successfully',
                data,
            });
        } catch (error) {
            res.status(400).send('Error ::' + error.message);
        }
    }
);

module.exports = requestRouter;
