const Letter = require('../models/Letter');

const getLetter = async (req, res) => {
  try {
    const letter = await Letter.findOne().sort({ createdAt: -1 });
    if (!letter) {
      return res.status(404).json({ success: false, message: 'No letter found' });
    }
    res.json({ success: true, data: letter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const seedLetter = async () => {
  try {
    const count = await Letter.countDocuments();
    if (count === 0) {
      await Letter.create({
        title: 'A Letter For You',
        content: `Happy Birthday! 🎂\n\nOn this special day, I wanted to take a moment to tell you how much you mean to me.\n\nEvery moment spent with you is a treasure. Your smile lights up my world, and your laughter is the sweetest melody I've ever heard.\n\nYou are kind, you are beautiful, you are extraordinary. The world is a better place because you are in it.\n\nI hope today brings you as much joy as you bring to everyone around you. May your heart be filled with love, your eyes with wonder, and your soul with peace.\n\nHere's to many more beautiful moments together.\n\nWith all my love,\nYour Special Someone 💕`
      });
    }
  } catch (error) {
    console.error('Letter seed error:', error.message);
  }
};

module.exports = { getLetter, seedLetter };
