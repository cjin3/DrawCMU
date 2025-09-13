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

  const [board, setBoard] = useState({});

  useEffect(() => {
    console.log("User:", username, "joined room:", roomCode);
    const fetchData = async () => {
      try {
        console.log("getting database info from ", `rooms/${roomCode}/info`)
        const ref1 = ref(db, `rooms/${roomCode}/info`);
        const snap = await get(ref1);

        if (snap.exists()) {
          const data = snap.val();
          console.log("data is", data.pixels);
          setBoard(data.pixels);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching board:", err);
      }
    
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("board updated:", board);
  }, [board]);


  return (
  <div className="board-wrap">
    {/* Toolbar */}
    <div className="toolbar">
      <div className="toolbar-left">
        <span>Room: <strong id="roomName">{roomCode}</strong></span>
        <span>Grid: <strong id="gridInfo">64×64</strong></span>
      </div>
      <div className="toolbar-right">
        Left click to paint · Right click to erase · Shift+drag to pan
      </div>
    </div>

    {/* Main Board Area */}
    <div className="board-main">
      {/* Palette */}
      <div className="palette">
        {paletteColors.map((color, idx) => (
          <div
            key={idx}
            className={`palette-color ${currentColor === color ? "active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
          />
        ))}

        {/* Eraser */}
        <div
          className={`palette-color eraser ${currentColor === "#ffffff" ? "active" : ""}`}
          onClick={() => setCurrentColor("#ffffff")}
          title="Eraser"
        >
          🧽
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-wrapper">
        <canvas id="board" width="512" height="512">
            {/* Draw a colored square using canvas API */}
            {useEffect(() => {
              console.log("board is", board)
              const canvas = document.getElementById("board");
              const pixelSize = canvas.width / 64;

              if (!canvas) return;
              const ctx = canvas.getContext("2d");
              // Draw a square that takes up 1/100 of the board (10x10 grid)
              // pixel.
                if (ctx && board) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                Object.entries(board).forEach(([coord, color]) => {
                  const [x, y] = coord.split(',').map(Number);
                  ctx.fillStyle = color;
                  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                });
                }


            })}


          </canvas>
      </div>
    </div>
  </div>
);
}