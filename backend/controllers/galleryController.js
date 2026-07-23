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
    await Gallery.deleteMany({});
    const items = [
      {
        imageUrl: '/assets/images/birthday1.jpeg',
        caption: 'Happy Birthday! 💖',
        order: 1
      },
      {
        imageUrl: '/assets/images/birthdat2.jpeg',
        caption: 'Special Moments ✨',
        order: 2
      },
      {
        imageUrl: '/assets/images/middle-pic.jpeg',
        caption: 'You & Me 💕',
        order: 3
      }
    ];
    await Gallery.insertMany(items);
    console.log('Gallery seeded with local images.');
  } catch (error) {
    console.error('Gallery seed error:', error.message);
  }
};

module.exports = { getGallery, seedGallery };
