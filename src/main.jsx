import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import Tailwind
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import { BrowserRouter } from 'react-router-dom';
import { SerialNumberProvider } from './context/SerialNumberContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>

            <SerialNumberProvider>
                  <App />

          {/* Other components */}
        </SerialNumberProvider>
    
    </BrowserRouter>
  </React.StrictMode>
);
