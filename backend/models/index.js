const mongoose = require('mongoose');

const eventSchema = require('./event');
const commentSchema = require('./comment');
const userSchema = require('./user');


const Event = mongoose.model('Event', eventSchema);
const Comment = mongoose.model('Comment', commentSchema);
const User = mongoose.model('User', userSchema);


module.exports = {
    Comment,
    Event,
    User,
 

}