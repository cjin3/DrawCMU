import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import CanvasBoard from "./Canvas";
import { useState } from "react";
import { useRef } from "react";
import HueBar from "./HueBar";
import { Player } from "./player";
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

let curGlobalColor = "#ff1300";

export default function Board() {
  const { roomCode } = useParams();
  const location = useLocation();
  const username = location.state?.username || "Anonymous";
  const [board, setBoard] = useState({});

  const [curColor, setColor] = useState("#af1b1bff");

  const canvasref = useRef(null);
  const [swatches, setSwatches] = useState([]); // up to 3 custom colors
  const hiddenColorInput = useRef(null);
  const addSwatch = (color) => {
    setSwatches((prev) => {
      let updated = [...prev, color];
      if (updated.length > 3) {
        updated = updated.slice(updated.length - 3); // keep only last 3
      }
      return updated;
    });
    //curColor = color;
    setColor(color);
  };
  const handleHueBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percent = y / rect.height;
    const hue = Math.round(percent * 360);
    const newColor = `hsl(${hue}, 100%, 50%)`;
    addSwatch(newColor);
  };

  const handleHueBarDblClick = () => {
    if (hiddenColorInput.current) hiddenColorInput.current.click();
  };

  const paintCell = (x, y, color) => {
    if (x < 0 || y < 0 || x >= length || y >= width) return;
    try {
      console.log("painting " + color)

      let pixelref = ref(db, `rooms/${roomCode}/info/pixels/${x},${y}`);
      set(pixelref, color).then(() => console.log(`changed pixel!`))
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
    console.log("Current color is:", curColor);
  }, [curColor]);

  return (
    <div className="board-wrap">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <span>Room: <strong id="roomName">{roomCode}</strong></span>
          <span>Grid: <strong id="gridInfo"></strong></span>
        </div>
        <div className="toolbar-right">
          Left click to paint
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
              onClick={() => { setColor(color); curGlobalColor = color; console.log("clicked: " + curColor)}}
            />
          ))}

          {/* Eraser */}
          <div
            className={`palette-color eraser ${curColor === "#ffffff" ? "active" : ""}`}
            onClick={() => { setColor("#ffffff"); curGlobalColor = "#ffffff"; console.log("clicked eraser" + curColor) }}
            title="Eraser"
          >
            🧽
          </div>

        {/* Custom Swatches (max 3) */}
          <div className="swatches">
            {swatches.map((color, idx) => (
              <div
                key={idx}
                className={`palette-color ${curColor === color ? "active" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => { setColor(color); curGlobalColor = color; console.log("clicked swatch: " + curColor)}}
              />
            ))}
          </div>
          
          {/* Add Custom Color */}
          <HueBar
          onColorSelect={(newColor) => addSwatch(newColor)}
          onDoublePick={handleHueBarDblClick}
          />

          {/* Hidden input for system color picker */}
          <input
            type="color"
            ref={hiddenColorInput}
            style={{ display: "none" }}
            onChange={(e) => addSwatch(e.target.value)}
          />
   
        </div>

        {/* Canvas */}
        <div className="canvas-wrapper">
          <canvas id="board" width="512" height="512">
            {useEffect(() => {
              // console.log("board is", board)
              const canvas = document.getElementById("board");
              const pixelSize = canvas.width / board.size;

              setColor(curGlobalColor);

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

            }, [board, curColor])}

            {useEffect(() => {
              const canvas = document.getElementById("board");
              canvas.addEventListener('mousedown',
                (e) => {
                  e.preventDefault();
                  const rect = canvas.getBoundingClientRect();
                  mouseX = Math.floor((e.clientX - rect.left) / pixelSize);
                  mouseY = Math.floor((e.clientY - rect.top) / pixelSize);
                  mouseDrag = true;
                  const colorIdx = curGlobalColor;
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
                  const rect = canvas.getBoundingClientRect();

                  mouseX = Math.floor((e.clientX - rect.left) / pixelSize);
                  mouseY = Math.floor((e.clientY - rect.top) / pixelSize);
                  if (mouseDrag) {
                    const colorIdx = curGlobalColor;
                    paintCell(mouseX, mouseY, colorIdx);
                  }
                  
                  Player(mouseX, mouseY, db, roomCode, username);
                }
              )
              
            }, [])}

            
            
          </canvas>
        </div>
      </div>
    </div>
  );
}