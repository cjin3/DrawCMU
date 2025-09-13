import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import CanvasBoard from "./Canvas";
import { useState } from "react";



export function populate(db, roomCode) {
  let roomRef = ref(db, `rooms/${roomCode}/info/pixels`);
  let pixels = {};
  for (let i = 0; i < 64; i++) {
    for (let j = 0; j < 64; j++) {
      if (Math.random() < 0.1) {
        const color = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"][Math.floor(Math.random() * 5)];
        pixels[`${i},${j}`] = color;
      }
    }
  }
  set(roomRef, pixels).then(() => console.log(`Room ${roomCode} populated!`))
    .catch(err => console.error("Error populating room:", err));
}

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
  const paletteColors = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"];
  const [currentColor, setCurrentColor] = useState(paletteColors[0] || "#000000");
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

      <div className="panel center board-canvas">
        <div style={{ display: "flex", gap: "10px" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {paletteColors.map((color, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentColor(color)}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: color,
                  border: currentColor === color ? "3px solid black" : "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            ))}
            <div
          onClick={() => setCurrentColor("#ffffff")}
          title="Eraser"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            backgroundColor: "#fff",
            borderRadius: "5px",
            border: currentColor === "#ffffff" ? "3px solid #333" : "1px solid #ccc",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          🧽
        </div>

          </div>
          <CanvasBoard />

        </div>
      </div>


    </div>
  );
}