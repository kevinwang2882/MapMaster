const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const comment = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 250
          },
        writer:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }
)

module.exports =  comment