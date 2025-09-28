import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import './index.css';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/mira/theme.css";
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <ReduxProvider store={store}>
        <Router>
          <App />
        </Router>
      </ReduxProvider>
    </PrimeReactProvider>
  </StrictMode>
);
