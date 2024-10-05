const mongoose = require('mongoose');

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
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Simple email regex pattern
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
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
          const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
          return passwordRegex.test(pwd);
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
