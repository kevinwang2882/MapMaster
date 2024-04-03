const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const User = new Schema(
    {
        googleId: {type: String, },
        userName:{type: String, },
        events:{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}
    }
)

module.exports =  User