const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const session = require('express-session');
const passport = require('passport');
const connectDB = require('./db');

connectDB();

const commentController = require('./controllers/commentController');
const eventController = require('./controllers/eventController');
const userController = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT 

// Middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post('/api/comment/', commentController.createComment);
app.put('/api/comment/', commentController.updateComment);
app.delete('/api/comment/', commentController.deleteComment);
app.get('/api/comment/', commentController.getComment);

app.put('/api/event/', eventController.updateEvent);
app.delete('/api/event/', eventController.deleteEvent);
app.post('/api/event/', eventController.createEvent);
app.get('/api/event/', eventController.getEvents);

app.post('/api/user/', userController.createUser);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
