// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Tervetuloa vieraskirjaan!</h1>
      <p>
        Tällä sivulla voit <Link to="/form">lisätä viestin</Link> ja nähdä
        <Link to="/messages"> aiemmat viestit</Link>.
      </p>
    </div>
  );
};

export default Home;
