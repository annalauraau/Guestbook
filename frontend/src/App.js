import React from 'react';
import { Routes, Route } from 'react-router-dom';  // Correct import for React Router v6
import Home from './components/home';  // Ensure file name and component name match
import Form from './components/Form';  // Ensure file name and component name match
import Guestbook from './components/Guestbook';  // Ensure file name and component name match

const App = () => {
  return (
    <div>
      <Routes>  {/* React Router's Routes container */}
        <Route path="/" element={<Home />} />  {/* Home component for the root path */}
        <Route path="/newmessage" element={<Form />} />  {/* Form component for creating new messages */}
        <Route path="/guestbook" element={<Guestbook />} />  {/* Guestbook component for viewing messages */}
      </Routes>
    </div>
  );
};

export default App;
