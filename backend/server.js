require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const searchRoutes = require('./routes/searchRoutes');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/questions', questionRoutes);

app.get('/', (req, res) => {
  res.send({
    activestatus: true,
    error:false,
  })
})



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});