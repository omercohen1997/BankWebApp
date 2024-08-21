const User = require('../models/User')
const bcrypt = require('bcrypt')




// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create a new user
const signUp = async (req, res) => {
    const {password, phoneNumber, email, balance } = req.body;

    // Check if all required fields are provided
    if (!password || !phoneNumber || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const phoneNumberRegex = /^(\d{3}-?\d{3}-?\d{4})$/;
    // Validate phone number format
    if (!phoneNumberRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }


    // Check if the user already exists
    const duplicate = await User.findOne({ email }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'User already exists the email should be unique' });
    }

    try {
        // Create and store the new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            password: hashedPassword,
            phoneNumber,
            email,
            balance
        });
        
        res.status(201).json({ message: `User with email ${email} created successfully` });
        //res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Delete a user by ID
const deleteUser = async (req, res) => {
    const userId = req.params.id;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    try {
      // Find and delete the user by ID
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  

      res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports = {
    getAllUsers,
    signUp,
    deleteUser
};
