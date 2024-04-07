import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthProvider } from './component/useGoogleAuth';
import {BrowserRouter} from 'react-router-dom';
import { CommentProvider } from './component/comment';
import App from './App';

// Retrieve the Google client ID from the environment variable
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
    <BrowserRouter>
    <CommentProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <GoogleAuthProvider>
        
          <App />
         
        </GoogleAuthProvider>
      </GoogleOAuthProvider>
      </CommentProvider>
    </BrowserRouter>
  </React.StrictMode>,
);