import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Board() {
  const { roomCode } = useParams();
  const location = useLocation();
  const username = location.state?.username || "Anonymous";

  useEffect(() => {
    console.log("User:", username, "joined room:", roomCode);
    // 👉 Canvas setup logic will go here later
  }, [roomCode, username]);

  return (
    <div className="board-wrap">
      {/* Toolbar */}
      <div className="panel toolbar">
        <div className="meta">Room: <strong id="roomName">{roomCode}</strong></div>
        <div className="meta">Grid: <strong id="gridInfo">64x64</strong></div>
        <div style={{ flex: 1 }}></div>
        <div className="meta">
          Left click to paint · Right click to erase · Shift+drag to pan
        </div>
      </div>

      {/* Canvas */}
      <div className="panel center board-canvas">
        <canvas id="board" width="512" height="512"></canvas>
      </div>
    </div>
  );
}