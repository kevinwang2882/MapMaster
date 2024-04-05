const { User, Event } = require('../models');


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
  console.log(req.body);
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
    console.log(savedEvent._id)
    
    user.events.push(savedEvent._id);
   
    await user.save();
  
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


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

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


  const updateEvent = async (req, res) => {
  console.log('REQBODYYYYYYY', req.body);
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
module.exports ={
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent

}