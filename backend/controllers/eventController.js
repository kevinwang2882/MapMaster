const { User, Event,Comment } = require('../models');


  const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


  const createEvent = async (req, res) => {

  try {
    const { name, address, coordinates, imageUrl, description,rate,type, userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username } = user;

    const newEvent = new Event({
      userId,
      name,
      author: username,
      address,
      coordinates,
      imageUrl,
      type,
      description,
      rate,
    });

    const savedEvent = await newEvent.save();
    
    user.events.push(savedEvent._id);
   
    await user.save();
  
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const getLikes = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const likes = event.likes;

    res.status(200).json({ likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

  const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = event.userId;

    await User.findByIdAndUpdate(userId, {
      $pull: { events: eventId }
    });

    const commentId = event.comments;
    
    await Comment.findByIdAndUpdate(commentId, {
      $pull: { events: eventId }
    });

    await Event.findByIdAndDelete(eventId);
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


  const updateEvent = async (req, res) => {
  try {
    const userId = req.body.userId;
    const eventId = req.params.id;

    if (!eventId || !userId) {
      return res.status(400).json({ message: 'User ID and Event ID are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Event does not belong to this user' });
    }

    const eventData = {
      name: req.body.name || event.name,
      address: req.body.address || event.address,
      imageUrl: req.body.imageUrl || event.imageUrl,
      description: req.body.description || event.description,
      rate: req.body.rate || event.rate,
      type: req.body.type || event.type,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


const createLike = async (req, res) => {
  const { eventId, userId } = req.params;
  const { action } = req.body;

  try {
    let event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (action !== 'like' && action !== 'dislike') {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const likeField = action === 'like' ? 'likes' : 'dislikes';
    const oppositeField = action === 'like' ? 'dislikes' : 'likes';

    // Using $addToSet to ensure uniqueness
    await Event.updateOne(
      { _id: eventId },
      {
        $addToSet: { [likeField]: userId },
        $pull: { [oppositeField]: userId }
      }
    );

    res.status(200).json({ message: 'Action saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports ={
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
  createLike,
  getLikes

}