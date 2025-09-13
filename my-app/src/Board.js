import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

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

const width = 200;
const length = 200;
const pixelLength = 4;
const boardSize = width * pixelLength;
const paletteColors = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"];

export default function Board() {
  const { roomCode } = useParams();
  const location = useLocation();
  const username = location.state?.username || "Anonymous";

  const [board, setBoard] = useState({});
  const [curColor, setColor] = useState("#000000");
  const [users, setUsers] = useState({});
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const mouseDragRef = useRef(false);

  const paintCell = (x, y, color) => {
    if (x < 0 || y < 0 || x >= length || y >= width) return;
    const pixelRef = ref(db, `rooms/${roomCode}/info/pixels/${x},${y}`);
    set(pixelRef, color);
  };

  // Fetch board in real-time
  useEffect(() => {
    const boardRef = ref(db, `rooms/${roomCode}/info`);
    onValue(boardRef, (snapshot) => {
      if (snapshot.exists()) {
        setBoard(snapshot.val());
      }
    });

    const usersRef = ref(db, `rooms/${roomCode}/users`);
    onValue(usersRef, (snapshot) => {
      setUsers(snapshot.val() || {});
    });
  }, [roomCode]);

  // Update user's cursor position every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      const { x, y } = mousePosRef.current;
      set(ref(db, `rooms/${roomCode}/users/${username}/coords`), { x, y });
    }, 500);
    return () => clearInterval(interval);
  }, [roomCode, username]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pixels
    if (board.pixels) {
      Object.entries(board.pixels).forEach(([coord, color]) => {
        const [x, y] = coord.split(",").map(Number);
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelLength, y * pixelLength, pixelLength, pixelLength);
      });
    }

    // Draw usernames above cursors
    Object.entries(users).forEach(([user, data]) => {
      if (!data.coords) return;
      const { x, y } = data.coords;
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(user, x * pixelLength, y * pixelLength - 5);
    });
  }, [board, users]);

  // Canvas mouse events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current.x = Math.floor((e.clientX - rect.left) / pixelLength);
      mousePosRef.current.y = Math.floor((e.clientY - rect.top) / pixelLength);
      mouseDragRef.current = true;
      paintCell(mousePosRef.current.x, mousePosRef.current.y, curColor);
    };

    const handleMouseUp = () => {
      mouseDragRef.current = false;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current.x = Math.floor((e.clientX - rect.left) / pixelLength);
      mousePosRef.current.y = Math.floor((e.clientY - rect.top) / pixelLength);
      if (mouseDragRef.current) {
        paintCell(mousePosRef.current.x, mousePosRef.current.y, curColor);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [curColor]);

  return (
    <div className="board-wrap">
      <div className="toolbar">
        <div>Room: {roomCode}</div>
        <div>Grid: {width}x{length}</div>
      </div>

      <div className="board-main" style={{ display: "flex" }}>
        {/* Palette */}
        <div className="palette">
          {paletteColors.map((color) => (
            <div
              key={color}
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: color,
                border: curColor === color ? "3px solid #000" : "1px solid #999",
                marginBottom: "5px",
                cursor: "pointer",
              }}
              onClick={() => setColor(color)}
            />
          ))}
          <div
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: curColor === "#ffffff" ? "3px solid #000" : "1px solid #999",
              marginTop: "5px",
              cursor: "pointer",
            }}
            onClick={() => setColor("#ffffff")}
            title="Eraser"
          >
            🧽
          </div>
        </div>

        {/* Canvas */}
        <canvas
          id="board"
          ref={canvasRef}
          width={boardSize}
          height={boardSize}
          style={{ border: "1px solid black", marginLeft: "10px" }}
        />
      </div>
    </div>
  );
}
