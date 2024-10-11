const bcrypt = require('bcrypt');
const validator = require('validator');
const { fieldsValidator } = require('./fieldsValidation');

const ALLOWED_SIGNUP_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'password',
  'age',
  'skills',
  'userName',
  'photoUrl',
  'gender',
  'about',
  'profession',
];

const sanitizeSignupData = (userData) => {
  const sanitizedUser = {};

  Object.keys(userData).forEach(async (field) => {
    if (ALLOWED_FIELDS.includes(field)) {
      sanitizedUser[field] = userData[field];
    }
  });

  return sanitizedUser;
};

const validateSignupData = (signupData) => {
  const isSignUpAllowed = Object.keys(signupData).every((field) =>
    ALLOWED_SIGNUP_FIELDS.includes(field)
  );

  if (!isSignUpAllowed) {
    throw new Error('Problem signing up');
  }

  fieldsValidator(signupData);

  return true;
};

const encryptPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

module.exports = {
  sanitizeSignupData,
  encryptPassword,
  validateSignupData,
};
