const authRouter = require('./auth.routes');
const { profileRouter } = require('./profile.routes');
const requestRouter = require('./request.routes');
const feedRouter = require('./feed.routes');
const userRouter = require('./user.routes');

module.exports = {
    authRouter,
    profileRouter,
    requestRouter,
    feedRouter,
    userRouter,
};
