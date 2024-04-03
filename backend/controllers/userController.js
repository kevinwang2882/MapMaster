const { User } = require('../models');

const createUser = async (req, res) => {
  const userProfile = req.body;
  console.log('User profile', userProfile);
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

module.exports = {
  createUser,
};
