import React from "react";
import "./Home.css"; // import the stylesheet
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Home () {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomCode) return alert("Please enter a room code!");
    // Replace with navigation logic

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
