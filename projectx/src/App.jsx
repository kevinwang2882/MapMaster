import React, { useState, useContext } from 'react';
import { GoogleAuthContext } from './component/useGoogleAuth';
import Map from './component/googleMap';
import './App.css';

function App() {
  const { user, profile, login, logOut } = useContext(GoogleAuthContext);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="container">
      {user && (
        <button
          className={`profile-button ${showProfile ? 'active' : ''}`}
          onClick={() => setShowProfile(!showProfile)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
      )}
      {showProfile && profile ? (
        <div className="profile-section">
          <h3>User Logged in</h3>
          <p>Name: {profile.user?.userName}</p> {/* Access userName property */}
          <button onClick={logOut}>Log out</button>
        </div>
      ) : null}
      <div className="map-section">
        <Map user={user} profile={profile} />
      </div>
      {!profile ? (
        <div className="button-image">
          <button className="login-button" onClick={() => login()}>
            Sign in with Google 🚀
          </button>
          <div className="video-section">
        <div className="video-wrapper">
          <video
            src="https://videos.pexels.com/video-files/854394/854394-hd_1280_720_30fps.mp4"
            autoPlay
            loop
            muted
          />
        </div>
      </div>
        </div>
      ) : null}

    </div>
  );
}

export default App;