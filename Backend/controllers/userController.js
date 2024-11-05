const User = require('../models/User')
const bcrypt = require('bcrypt')
const { phoneNumberRegex, emailRegex } = require('../utils/validatePatterns')



const getBalance = async (req, res) => {
    const user = req.user

    try {
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

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
        const users = await User.find().select('-password')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error })
    }
}



const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error })
    }
}

const createAdmin = async (req, res) => {
    const { email, password, phoneNumber } = req.body;

    if (!email || !password || !phoneNumber) {
        return res.json(400).json({ error: 'All fields are required' })
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' })
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format' })
    }

    try {

        const adminDuplicate = await User.findOne({ email })

        if (adminDuplicate) {
            return res.status(409).json({ message: 'email already exists the email should be unique' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            email,
            password: hashedPassword,
            phoneNumber,
            role: 'admin'
        })
        return res.status(201).json({ message: `Admin ${email} created successfully` })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

module.exports = {
    getBalance,
    changePassword,
    getAllUsers,
    deleteUser,
    createAdmin
}
