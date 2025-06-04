import { enablePatches } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';
import { configureStoreInstance as configureStore } from './store';
import './index.css'
import App from './App.jsx'

enablePatches(); // Enable Immer patches

// Configure Redux store
const store = configureStore();

// Create root element and render the app
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Updated for React 18

root.render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </Provider>
);
