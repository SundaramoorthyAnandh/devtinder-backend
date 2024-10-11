const mongoose = require('mongoose');
const validate = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      minlength: [3, 'First Name should be at least 3 characters'],
      maxlength: [40, 'First Name cannot be over 40 characters'],
      trim: true, // Removes whitespace from both ends
    },
    lastName: {
      type: String,
      maxlength: [40, 'Last Name cannot be over 40 characters'],
      trim: true,
    },
    userName: {
      type: String,
      maxlength: [40, 'User Name cannot be over 40 characters'],
      trim: true,
      default: function () {
        return `${this.firstName} ${this.lastName ?? ''}`;
      },
    },
    profession: {
      type: String,
      maxlength: [100, 'Profession cannot be over 40 characters'],
      trim: true,
      required: true,
    },
    about: {
      type: String,
      maxlength: [1000, 'About cannot be more than 1000 characters'],
      trim: true,
      default: function () {
        return `I'm ${this.firstName} working as ${this.profession}`;
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return validate.isEmail(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      validate: {
        validator: function (pwd) {
          return validate.isStrongPassword(pwd, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          'Password must be at least 8 characters long, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
      },
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Others'],
      default: 'Others',
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Minimum age is 18'],
    },
    skills: {
      type: [String],
      required: [true, 'At least two skills are required'],
      validate: {
        validator: function (skills) {
          return skills.length >= 2;
        },
        message: 'Please provide at least two skills.',
      },
    },
    photoUrl: {
      type: String,
      validate: {
        validator: function (url) {
          return validate.isURL(url);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default:
        'https://png.pngtree.com/png-clipart/20191122/original/pngtree-user-icon-isolated-on-abstract-background-png-image_5192004.jpg',
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

module.exports = mongoose.model('User', userSchema);
