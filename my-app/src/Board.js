import React, { useEffect, useState } from "react";
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

  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    console.log("User:", username, "joined room:", roomCode);
    // 👉 Canvas setup logic will go here later
  }, [roomCode, username]);

  // Create a map from coordinate tuple "x,y" to a random number between 0 and 12 inclusive
  const [board, setBoard] = useState(() => {
    const map = new Map();
    for (let x = 0; x < 64; x++) {
      for (let y = 0; y < 64; y++) {
        map.set(`${x},${y}`, Math.floor(Math.random() * 13));
      }
    }
    return map;
  });

  const boardEdgeSize = board.size**.5

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
          {COLOR_PALETTE.entries().map(([index, color]) => {
            return <div className={`color ${index === colorIndex ? 'selected' : ''}`}
                        key={color} 
                        style={{ background: color } }
                        onClick={() => {setColorIndex(index)}}>
                    </div>;
          })}
        </div>
        {/* Canvas */}
        <div className="panel center">
          <canvas id="board" width="512" height="512">
            {/* Draw a colored square using canvas API */}
            {useEffect(() => {
              const canvas = document.getElementById("board");
              const pixelSize = canvas.width / boardEdgeSize;

              if (!canvas) return;
              const ctx = canvas.getContext("2d");
              // ctx.clearRect(0, 0, canvas.width, canvas.height);
              // Draw a square that takes up 1/100 of the board (10x10 grid)
              board.forEach((colorIdx, key) => {
                const [x, y] = key.split(',').map(Number);
                ctx.fillStyle = COLOR_PALETTE[colorIdx];
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
              });


            })}


          </canvas>
        </div>
      </div>
    </div>
  );
}
