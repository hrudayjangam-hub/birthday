const User = require('../models/User');

const seedDefaultUser = async () => {
  try {
    await User.findOneAndUpdate(
      { name: 'Default' },
      { name: 'Default', passcode: '050805' },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

const verifyPasscode = async (req, res) => {
  try {
    const { passcode } = req.body;
    if (!passcode || passcode.length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid passcode format' });
    }
    const user = await User.findOne({ passcode });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect passcode' });
    }
    res.json({ success: true, message: 'Access granted', user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passcode');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { verifyPasscode, getUsers, seedDefaultUser };
