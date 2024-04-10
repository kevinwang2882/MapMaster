const { User } = require('../models');

const createUser = async (req, res) => {
  const userProfile = req.body;
  try {
    let user = await User.findOne({ googleId: userProfile.id });
   
    if (!user) {
      user = await User.create({
        userName: userProfile.name,
        googleId: userProfile.id,
      });
      console.log('User created!', user);
      return res.status(201).json({ message: 'User created successfully', user });
    } else {
      console.log('User already exists');
      res.json({ message: 'Login successful', user });
    }
  } catch (err) {
    console.error('Error processing the profile:', err);
    return res.status(500).json({ message: 'Error processing the profile', error: err.message });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const updateUser = async (req, res) => {
  try {
    let { id } = req.params
    let user = await User.findByIdAndUpdate(id, req.body, { new: true})
    if (user) {
      return res.status(200).json(user)
    }
  } catch (e) {
    return res.status(500).json({ error: error.message})
  }
}

const deleteUser = async (req, res) => {
  try {
      const { id } = req.params
      const deleted = await User.findByIdAndDelete(id)
      if (deleted) {
          return res.status(200).send("User deleted")
      }
      throw new Error("User not found")
  } catch (error) {
      return res.status(500).send(error.message)
  }
}
const getUserById = async (req,res) => {
  try {
      const user = await User.findById(req.params.id).populate()
      if (user) {
          res.json(user)
      }
  } catch (error) {
      return res.status(500).send('Collection with the specified ID does not exists');
  }
}


module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
