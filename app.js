const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;  // Or any other port you wish to use

// MongoDB connection URI
const uri = "mongodb+srv://annastudenthi:anna@clusteranna.brxtp.mongodb.net/?retryWrites=true&w=majority&appName=Clusteranna";

// Middleware for parsing requests and allowing CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');  // Set EJS as the view engine

// MongoDB connection
mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// Define the message schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Home route (index)
app.get('/', (req, res) => {
  res.render('index', { title: "Welcome to the Guestbook" });
});

// Guestbook route - List all messages
app.get('/guestbook', async (req, res) => {
  try {
    const messages = await Message.find();
    res.render('guestbook', { title: "Guestbook", messages });
  } catch (error) {
    res.status(500).send("Error reading messages from MongoDB");
  }
});

// New message form route
app.get('/newmessage', (req, res) => {
  res.render('newmessage', { title: "Add a New Message" });
});

// New message POST route - Save the new message to MongoDB
app.post('/newmessage', async (req, res) => {
  const { name, message, country } = req.body;

  if (!name || !message || !country) {
    return res.status(400).send("Name, country, and message are required.");
  }

  const newMessage = new Message({
    name,
    country,
    message,
    date: new Date().toISOString()
  });

  try {
    await newMessage.save();
    res.redirect('/guestbook');
  } catch (error) {
    res.status(500).send("Error saving the message");
  }
});

// API Routes

// GET /api/getall - Return all documents
app.get('/api/getall', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
});

// GET /api/:id - Return one item with the given id
app.get('/api/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the message' });
  }
});

// POST /api/add - Create a new message
app.post('/api/add', async (req, res) => {
  const { name, message, country } = req.body;

  if (!name || !message || !country) {
    return res.status(400).json({ error: 'Name, message, and country are required' });
  }

  const newMessage = new Message({
    name,
    country,
    message,
    date: new Date().toISOString()
  });

  try {
    await newMessage.save();
    res.status(201).json(newMessage);  // Return the new message as a response
  } catch (error) {
    res.status(500).json({ error: 'Error saving the message' });
  }
});

// PUT /api/update/:id - Update a message by id
app.put('/api/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, message, country } = req.body;

  if (!name || !message || !country) {
    return res.status(400).json({ error: 'Name, message, and country are required' });
  }

  try {
    const updatedMessage = await Message.findByIdAndUpdate(id, { name, message, country, date: new Date() }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json(updatedMessage);  // Return the updated message
  } catch (error) {
    res.status(500).json({ error: 'Error updating the message' });
  }
});

// DELETE /api/delete/:id - Delete a message by id
app.delete('/api/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the message' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
