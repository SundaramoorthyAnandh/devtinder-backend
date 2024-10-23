const mongoose = require('mongoose');

const preferencesSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId, // Same _id as User
            ref: 'User',
            required: true,
        },
        age: {
            type: Number,
            required: true,
            default: 18,
            min: 18,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'all'],
            default: 'all',
            required: true,
        },
        skills: {
            type: [String],
            default: [],
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            index: true,
            // single field indexed because we always fetch preferences of user by querying with userId
        },
    },
    {
        timestamps: true,
        validateBeforeSave: true,
    }
);
const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;
