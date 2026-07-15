const Timeline = require('../models/Timeline');

const getTimeline = async (req, res) => {
  try {
    const events = await Timeline.find().sort({ order: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const seedTimeline = async () => {
  try {
    const count = await Timeline.countDocuments();
    if (count === 0) {
      const events = [
        { title: 'First Meeting', description: 'The day our paths crossed and everything changed forever.', imageUrl: 'https://picsum.photos/seed/timeline1/400/300', date: 'January 2024', order: 1 },
        { title: 'First Adventure', description: 'Exploring new places and making memories together.', imageUrl: 'https://picsum.photos/seed/timeline2/400/300', date: 'March 2024', order: 2 },
        { title: 'Sunset Memories', description: 'Watching the sun go down, hand in hand.', imageUrl: 'https://picsum.photos/seed/timeline3/400/300', date: 'June 2024', order: 3 },
        { title: 'Celebration', description: 'Laughing, dancing, and celebrating life together.', imageUrl: 'https://picsum.photos/seed/timeline4/400/300', date: 'September 2024', order: 4 },
        { title: 'Growing Together', description: 'Every day with you is a beautiful new chapter.', imageUrl: 'https://picsum.photos/seed/timeline5/400/300', date: 'December 2024', order: 5 }
      ];
      await Timeline.insertMany(events);
    }
  } catch (error) {
    console.error('Timeline seed error:', error.message);
  }
};

module.exports = { getTimeline, seedTimeline };
