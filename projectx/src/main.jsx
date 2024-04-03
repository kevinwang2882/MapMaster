import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthProvider } from './component/useGoogleAuth';
import {BrowserRouter} from 'react-router-dom';

import App from './App';

// Retrieve the Google client ID from the environment variable
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <GoogleAuthProvider>
          <App />
        </GoogleAuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);