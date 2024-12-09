const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3001;

const uri = "mongodb+srv://annastudenthi:anna@clusteranna.brxtp.mongodb.net/?retryWrites=true&w=majority&appName=Clusteranna";

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: "Welcome to the Guestbook" });
});

app.get('/guestbook', async (req, res) => {
  const searchQuery = req.query.search || '';  // Capture the search query from the URL (default to empty string if none)

  try {
    // Search for messages based on the search query (either in the name or country fields)
    const messages = await Message.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { country: { $regex: searchQuery, $options: 'i' } }
      ]
    });

    // Pass both searchQuery and messages to the view
    res.render('guestbook', { title: "Guestbook", messages, searchQuery });
  } catch (error) {
    res.status(500).send("Error reading messages from MongoDB");
  }
});


app.get('/newmessage', (req, res) => {
  res.render('newmessage', { title: "Add a New Message" });
});

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

app.post('/api/messages', async (req, res) => {
  const { name, message, country } = req.body;

  if (!name || !message || !country) {
    return res.status(400).json({ error: 'Name, message, and country are required' });
  }

  try {
    const newMessage = new Message({
      name,
      country,
      message,
      date: new Date().toISOString()
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving the message:', error);
    res.status(500).json({ error: 'Error saving the message' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
});

app.get('/api/messages/:id', async (req, res) => {
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

app.put('/api/messages/:id', async (req, res) => {
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

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the message' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
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

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});