import React, { useState, useEffect } from 'react';

const Guestbook = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/messages?search=${searchQuery}`);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, [searchQuery]); // Fetch messages whenever the search query changes

  return (
    <div>
      <h1>Guestbook</h1>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search messages"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
      />
      
      {/* Messages Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message._id}>
              <td>{message.name}</td>
              <td>{message.country}</td>
              <td>{message.message}</td>
              <td>{new Date(message.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Guestbook;
