import React, { useState } from 'react';

const NewMessageForm = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = { name, country, message };

    // Send the new message to the backend API
    fetch('http://localhost:3001/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Message added:', data);
      })
      .catch(error => console.error('Error adding message:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label>Country:</label>
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      />
      <label>Message:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewMessageForm;
