const jwt = require('jsonwebtoken');

const userAuth = async (req, resp, next) => {
  try {
    const { authToken } = req.cookies;

    if (!authToken) {
      resp.status(401).send('Invalid token. User not authorized');
    }

    const { _id } = await jwt.verify(authToken, 'SAJTSK@959924');

    if (_id) {
      // attaching "_id" to response and sending it to next middleware
      req._id = _id;
      next();
    } else {
      throw new Error('Invalid user');
    }
  } catch (error) {
    resp.status(401).send('ERROR ::' + error.message);
  }
};

module.exports = {
  userAuth,
};
