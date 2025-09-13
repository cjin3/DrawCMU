import "./Home.css"; // import the stylesheet
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";


export function createRoom(db, roomCode, size = 64, username) {
  
  const roomRef = ref(db, `rooms/${roomCode}/info`);
  
  const newRoom = {
    size: size,
    palette: ["#ffffff","#000000","#ff0000","#00ff00","#0000ff"], // example
    pixels: {"hi": 1} // empty sparse map
  };
  set(roomRef, newRoom).then(() => console.log(`Room ${roomCode} created!`))
  .catch(err => console.error("Error creating room:", err));
  
  
  const userRef = ref(db, `rooms/${roomCode}/users/${username}`);
  return set(userRef, {
    username,
    joinedAt: Date.now()
  });
}

export function addUserToRoom(db, roomCode, username) {
  const userRef = ref(db, `rooms/${roomCode}/users/${username}`);
  return set(userRef, {
    username,
    joinedAt: Date.now()
  });
}

export function createRooms(db, size = 64){
  const codes = ["retro", "digimedia", "healthsus", "gamify", "hackcmu"]
  for (let code of codes){
    let roomRef = ref(db, `rooms/${code}/info`);
    let newRoom = {
      size: size,
      palette: ["#ffffff","#000000","#ff0000","#00ff00","#0000ff"], // example
      pixels: {} 
    };
    set(roomRef, newRoom).then(() => console.log(`Room ${code} created!`))
    .catch(err => console.error("Error creating room:", err));

    const userRef = ref(db, `rooms/${code}/users/`);
     set(userRef, {} );
  }
}