const { Schema } = require('mongoose')

const Event = new Schema(
    {
       
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        comments: { type: Schema.Types.ObjectId, ref: 'comment', required: true },
        name:{type: String , required: true},
        address:{type: String , required: true},
        coordinates: {
            lat: {
              type: Number,
              required: true,
              min: -90,
              max: 90
            },
            lng: {
              type: Number,
              required: true,
              min: -180,
              max: 180
            }},

        imageUrl:{type: String , required: true},
        description:{type: String , required: true},
        rate:{type: String , required: true},
    },
    { timestamps: true },
)

module.exports = Event