import React from "react";
import "./Home.css"; // import the stylesheet
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiDixs8VRwm5PJyvJic8puhJTMwzb5ESA",
  authDomain: "drawcmu-3daa1.firebaseapp.com",
  projectId: "drawcmu-3daa1",
  databaseURL: "https://drawcmu-3daa1-default-rtdb.firebaseio.com/",
  storageBucket: "drawcmu-3daa1.firebasestorage.app",
  messagingSenderId: "181826924059",
  appId: "1:181826924059:web:96d14b5f07f97abb1b52be",
  measurementId: "G-RXM5255S3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      username: "",
    };
  }

function Home () {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomCode) return alert("Please enter a room code!");

    if (!username) return alert("Please enter a username!");

    set(ref(db, `rooms/${roomCode}/users/${username}`), {
      username,
      joinedAt: Date.now()
    })
    .then(() => {
      console.log({roomCode, username});

    })
    .catch((error) => {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please try again.");
    });
    
    console.log("Joining room:", roomCode, "as", username);
    navigate(`/draw/${roomCode}`);
  };

    return (
      <div className="home-container">
        <div className="home-card">
          <h1>🎨 r/place Mini</h1>
          <p>Enter a room code to join a canvas</p>
      <form onSubmit={handleSubmit} className="home-form">
        <input
          className="home-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="home-input"
          type="text"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button type="submit">Join Room</button>
      </form>
        </div>
      </div>
    );
  }

export default Home;
