import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // ✅ make sure this file is in the same folder

export default function Home() {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) return alert("Enter your username!");
    if (!roomCode) return alert("Enter a room code!");
    navigate(`/room/${roomCode}`, { state: { username } });
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>🎨 DrawCMU</h1>
        <p>Enter a room code to join a canvas</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="home-input"
          />
          <input
            type="text"
            placeholder="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="home-input"
          />
          <button type="submit" className="home-button">
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
