const User = require('../models/User')
const bcrypt = require('bcrypt')



// Get the balance of the logged-in user
const getBalance = async (req, res) => {
    const user = req.user

    try {
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        /*   // Find the user by ID
          const user = await User.findById(userId).exec()
  
          if (!user) {
              return res.status(404).json({ message: 'User not found' })
          } */

        res.status(200).json({ email: user.email, balance: user.balance })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const changePassword = async (req, res) => {
    const user = req.user
    const { oldPassword, newPassword } = req.body

    try {
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }


        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new passwords are required' })
        }


        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()

        res.status(200).json({ message: 'Password changed successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}



const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}

module.exports = {
    getBalance,
    changePassword,
    getAllUsers,
    deleteUser
}
