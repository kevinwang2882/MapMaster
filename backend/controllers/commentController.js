const { Comment, User, Event } = require('../models');


// Create a new comment
const getComment = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



const createComment = async (req, res) => {
  console.log("This is the body: ", req.body);
  try {
    const { userId, content, eventId ,userName } = req.body;
  
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newComment = new Comment({
      author: userId,
      content,
      event: eventId,
      userName:userName
    });
    const savedComment = await newComment.save();
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.comments.push(savedComment._id);
    await event.save();

    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const userId = req.params.id;
    const commentId = req.body.commentId;

    if (!userId || !commentId) {
      return res.status(400).json({ message: 'User ID and Comment ID are required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'Comment does not belong to this user' });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  console.log("This is the body: ", req.body);
  console.log("This is the params: ", req.params);
  try {
    const userId = req.params.id;
    const { commentId, text } = req.body;

    if (!commentId) {
      return res.status(400).json({ message: 'Comment id is required' });
    }
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    comment.content = text;
    const updatedComment = await comment.save();

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
  getComment
};