const User = require("../Model/UserModel");

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching users" });
    }
};

//Add user
const addUser = async (req, res) => {
const { name, gmail, address, phone } = req.body;
    try {
        const user = new User({ name, gmail, address, phone });
        await user.save();
        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding user" });
    }
};

//Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user" });
    }
};

//Update User
const updateUser = async (req, res) => {
const { name, gmail, address, phone } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, gmail, address, phone },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating user" });
    }
};

//Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting user" });
    }
};

module.exports = { getAllUsers, addUser, getUserById, updateUser, deleteUser };
