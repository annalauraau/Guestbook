// Form.js (Frontend)
import React, { useState } from 'react';

const Form = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/newmessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, message, country })
    });

    if (response.ok) {
      setName('');
      setMessage('');
      setCountry('');
    } else {
      console.log('Failed to submit message');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Country:</label>
        <input 
          type="text" 
          value={country} 
          onChange={(e) => setCountry(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
