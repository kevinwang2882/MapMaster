const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const comment = new Schema(
    {
        content: [{
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 250
          }],
        author:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        event:[{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
        userName:{type: String, },
    }
)

module.exports =  comment