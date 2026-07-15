const Gallery = require('../models/Gallery');

const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1 });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const seedGallery = async () => {
  try {
    const count = await Gallery.countDocuments();
    if (count === 0) {
      const items = [];
      for (let i = 1; i <= 9; i++) {
        items.push({
          imageUrl: `https://picsum.photos/seed/gallery${i}/600/600`,
          caption: `Memory ${i}`,
          order: i
        });
      }
      await Gallery.insertMany(items);
    }
  } catch (error) {
    console.error('Gallery seed error:', error.message);
  }
};

module.exports = { getGallery, seedGallery };
