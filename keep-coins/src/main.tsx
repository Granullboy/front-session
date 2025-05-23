import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';
import { ThemeProvider } from './components/theme/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</Provider>
  </React.StrictMode>
);

