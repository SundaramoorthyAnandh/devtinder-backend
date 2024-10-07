const bcrypt = require('bcrypt');
const validator = require('validator');

const ALLOWED_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'password',
  'age',
  'skills',
  'userName',
  'photoUrl',
  'gender',
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
  const { firstName, email, password, age, skills } = signupData;

  if (!firstName) {
    throw new Error('First Name cannot be empty');
  } else if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Password is too week');
  } else if (!validator.isNumeric(age)) {
    throw new Error('Age should be a number');
  } else if (age < 18) {
    throw new Error('Minimum age requirement is 18');
  } else if (skills.length < 3 || skills.length > 10) {
    throw new Error('Number of skills should be between 3 and 10');
  }

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
