const mongoose = require('mongoose');

const preferencesSchema = mongoose.Schema(
    {
        age: {
            type: Number,
            required: true,
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
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
            // single field indexed because we always fetch preferences of user by querying with userId
        },
    },
    {
        timestamps: true,
        validateBeforeSave: true,
    }
);

module.exports = mongoose.model('Preferences', preferencesSchema);
