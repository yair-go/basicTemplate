import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
// BrowserRouter מאפשר לאפליקציה להחזיק כמה דפים לפי הכתובת (/, /hello ...)
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
