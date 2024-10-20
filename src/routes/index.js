const authRouter = require('./auth.routes');
const profileRouter = require('./profile.routes');
const requestRouter = require('./request.routes');
const usersRouter = require('./users.routes');

module.exports = {
    authRouter,
    profileRouter,
    requestRouter,
    usersRouter,
};
