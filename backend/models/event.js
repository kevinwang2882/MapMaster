const { Schema } = require('mongoose')

const Event = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      type: {
        lat: { type: Number, required: true, min: -90, max: 90 },
        lng: { type: Number, required: true, min: -180, max: 180 }
      },
      required: true
    },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    rate: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = Event