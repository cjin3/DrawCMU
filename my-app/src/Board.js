import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";

const COLOR_PALETTE = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Lime
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FFA500", // Orange
  "#800080", // Purple
  "#00FFFF", // Cyan
  "#FFC0CB", // Pink
  "#808080", // Gray
  "#8B4513", // Brown
];

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
        <div className="meta">
          Room: <strong id="roomName">{roomCode}</strong>
        </div>
        <div className="meta">
          Grid: <strong id="gridInfo">64x64</strong>
        </div>
        <div style={{ flex: 1 }}></div>
        <div className="meta">Left click to paint</div>
      </div>

      <div className="board-canvas">
        {/* Palette */}
        <div className="panel palette">
          {COLOR_PALETTE.map((color) => {
            return <div className="color" key={color} style={{ background: color }}></div>;
          })}
        </div>
        {/* Canvas */}
        <div className="panel center">
          <canvas id="board" width="512" height="512"></canvas>
        </div>
      </div>
    </div>
  );
}
