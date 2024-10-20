const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ['accepted', 'rejected', 'interested', 'ignored'],
                // interested -right swipe | ignored - left swipe | accepted - accepting incoming req | rejected - canceling in coming req
                message: 'Invalid status type - {value}',
            },
        },
    },
    {
        timestamps: true,
        validateBeforeSave: true,
    }
);

// compound or partial indexing
//https://mongoosejs.com/docs/api/schema.html#Schema.prototype.index()
connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1,
});

const ConnectionRequestModel = new mongoose.model(
    'ConnectionRequest',
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;
