import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import CanvasBoard from "./Canvas";
import { useState } from "react";
import { useRef } from "react";
import HueBar from "./HueBar";
// 👾

const width = 128;
const length = 128;
const pixelSize = 4;
const boardSize = 512;
let paletteColors = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"]
let mouseX = 0;
let mouseY = 0;
let mouseDrag = false;

function getData(roomCode) {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  let sizeref = ref(db, `rooms/${roomCode}/info/size`);
  let size = get(sizeref).then((snapshot) => {
    if (snapshot.exists()) {
      width = size;
      length = size;
    } else {
      console.log("No size data available");
    }
  }).catch((error) => {
    console.error(error);
  })
}

export function clear(db, roomCode) {
  let roomRef = ref(db, `rooms/${roomCode}/info/pixels`);
  let pixels = {};
  set(roomRef, pixels).then(() => console.log(`Room ${roomCode} cleared!`))
    .catch(err => console.error("Error clearing room:", err));
}

export function Populate(db, roomCode) {
  let roomRef = ref(db, `rooms/${roomCode}/info/pixels`);
  let pixels = {};
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < length; j++) {
      if (Math.random() < 0.1) {
        pixels[`${i},${j}`] = paletteColors[1];
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

let curColor = "#ff1300";

export default function Board() {
  const [currentColor, setCurrentColor] = useState("#fff100");
  const { roomCode } = useParams();
  const location = useLocation();
  const username = location.state?.username || "Anonymous";
  const [board, setBoard] = useState({});
  const canvasref = useRef(null);


  const paintCell = (x, y, color) => {
    if (x < 0 || y < 0 || x >= length || y >= width) return;
    try {
      console.log("painting " + currentColor)

      let pixelref = ref(db, `rooms/${roomCode}/info/pixels/${x},${y}`);
      set(pixelref, curColor).then(() => console.log(`changed pixel!`))
    } catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
    console.log("User:", username, "joined room:", roomCode);
    const fetchData = async () => {
      try {
        console.log("getting database info from ", `rooms/${roomCode}/info`)
        const ref1 = ref(db, `rooms/${roomCode}/info`);
        // const snap = await get(ref1);//change to on value
        onValue(ref1, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            // console.log("data ia", data);
            setBoard(data);
          } else {
            console.log("No such document!");
          }
        });


      } catch (err) {
        console.error("Error fetching board:", err);
      }

    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("board updated:", board);
  }, [board]);

  useEffect(() => {
    console.log("Current color is:", currentColor);
  }, [currentColor]);

  return (
    <div className="board-wrap">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <span>Room: <strong id="roomName">{roomCode}</strong></span>
          <span>Grid: <strong id="gridInfo"></strong></span>
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
              className={`palette-color ${curColor === color ? "active" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => { curColor = color; console.log("clicked: " + currentColor)}}
            />
          ))}

          {/* Eraser */}
          <div
            className={`palette-color eraser ${curColor === "#ffffff" ? "active" : ""}`}
            onClick={() => { curColor = "#ffffff"; console.log("clicked eraser" + currentColor) }}
            title="Eraser"
          >
            🧽
          </div>

          {/* Add Custom Color */}
          <HueBar
            onColorSelect={(newColor) => {
              if (!paletteColors.includes(newColor)) {
                paletteColors = [...paletteColors, newColor];
              }
              setCurrentColor(newColor);
            }}
          />
        </div>

        {/* Canvas */}
        <div className="canvas-wrapper">
          <canvas id="board" width="512" height="512">
            {/* Draw a colored square using canvas API */}
            {useEffect(() => {
              // console.log("board is", board)
              const canvas = document.getElementById("board");
              const pixelSize = canvas.width / board.size;

              if (!canvas) return;
              const ctx = canvas.getContext("2d");

              if (ctx && board.pixels) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                Object.entries(board.pixels).forEach(([coord, color]) => {
                  const [x, y] = coord.split(',').map(Number);
                  ctx.fillStyle = color;
                  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                });
              }

            }, [board])}

            {useEffect(() => {
              const canvas = document.getElementById("board");
              canvas.addEventListener('mousedown',
                (e) => {
                  e.preventDefault();
                  const rect = canvas.getBoundingClientRect();
                  mouseX = Math.floor((e.clientX - rect.left) / pixelSize);
                  mouseY = Math.floor((e.clientY - rect.top) / pixelSize);
                  mouseDrag = true;
                  const colorIdx = curColor;
                  paintCell(mouseX, mouseY, colorIdx);
                }
              )
              canvas.addEventListener('mouseup',
                (e) => {
                  e.preventDefault();
                  mouseDrag = false;
                }
              )
              canvas.addEventListener('mousemove',
                (e) => {
                  e.preventDefault();
                  if (mouseDrag) {
                    const rect = canvas.getBoundingClientRect();
                    mouseX = Math.floor((e.clientX - rect.left) / pixelSize);
                    mouseY = Math.floor((e.clientY - rect.top) / pixelSize);
                    const colorIdx = curColor;
                    paintCell(mouseX, mouseY, colorIdx);
                  }
                }
              )
            }, [])}


            {useEffect(() => {
              //const canvas = canvasref.current;
              // const canvas = document.getElementById("board");

            }, [])}
          </canvas>
        </div>
      </div>
    </div>
  );
}