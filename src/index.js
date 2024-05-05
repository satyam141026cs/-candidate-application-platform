import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import {store} from './redux/store';
ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
    <Router> {/* Wrap your App component with BrowserRouter */}
      <App />
    </Router>
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
