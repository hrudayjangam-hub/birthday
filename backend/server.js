const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { seedDefaultUser } = require('./controllers/userController');
const { seedGallery } = require('./controllers/galleryController');
const { seedLetter } = require('./controllers/letterController');
const { seedTimeline } = require('./controllers/timelineController');

dotenv.config();

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/letters', require('./routes/letterRoutes'));
app.use('/api/timeline', require('./routes/timelineRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  await seedDefaultUser();
  await seedGallery();
  await seedLetter();
  await seedTimeline();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
