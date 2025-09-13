import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";

export default function Board() {
  const { roomCode } = useParams();
  const location = useLocation();
  const username = location.state?.username || "Anonymous";

  useEffect(() => {
    console.log("User:", username, "joined room:", roomCode);

    // 👉 Place your pixel board setup code here
    // Example: initCanvas();

  }, [roomCode, username]);

  return (
    <div className="board-page">
      <h2>Room: {roomCode}</h2>
      <p>User: {username}</p>
      <canvas id="board" width="512" height="512"></canvas>
    </div>
  );
}