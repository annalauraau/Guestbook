const express = require('express');
const fs = require('fs-extra'); // Ensure fs-extra is installed
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000; // You can change the port if needed
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static('public')); // Serve static files from public directory
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Route for the homepage
app.get('/', (req, res) => {
    res.render('index'); // Render the frontpage (index.ejs)
});

// Route for the guestbook page
app.get('/guestbook', (req, res) => {
    fs.readJson(MESSAGES_FILE, (err, messages) => {
        if (err) {
            messages = []; // If the file doesn't exist, start with an empty array
        }
        res.render('guestbook', { messages }); // Render guestbook.ejs with messages
    });
});

// Route for the new message form
app.get('/newmessage', (req, res) => {
    res.render('newmessage'); // Render newmessage.ejs (form page)
});

// Route for handling new message submissions
app.post('/newmessage', (req, res) => {
    const newMessage = {
        username: req.body.username,
        country: req.body.country,
        message: req.body.message,
        date: new Date().toISOString() // Use ISO string for timestamp
    };

    // Read the existing messages from the JSON file
    fs.readJson(MESSAGES_FILE, (err, messages) => {
        if (err) {
            messages = []; // If the file doesn't exist, start with an empty array
        }
        messages.push(newMessage); // Add the new message to the array
        fs.writeJson(MESSAGES_FILE, messages, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            }
            res.redirect('/guestbook'); // Redirect back to the guestbook page
        });
    });
});

// Route for the AJAX message form (GET)
app.get('/ajaxmessage', (req, res) => {
    res.render('ajaxmessage'); // Render ajaxmessage.ejs (form page)
});

// Route to handle AJAX message submissions (POST)
app.post('/ajaxmessage', (req, res) => {
    const newMessage = {
        username: req.body.username,
        country: req.body.country,
        message: req.body.message,
        date: new Date().toISOString() // Use ISO string for timestamp
    };

    // Read the existing messages from the JSON file
    fs.readJson(MESSAGES_FILE, (err, messages) => {
        if (err) {
            messages = []; // If the file doesn't exist, start with an empty array
        }
        messages.push(newMessage); // Add the new message to the array
        fs.writeJson(MESSAGES_FILE, messages, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            }
            res.json(messages); // Send all messages back as JSON response
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});