// import "./Home.css"; // import the stylesheet
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get } from "firebase/database";

// export function createRoommm(roomCode, size = 64) {
//   const roomRef = ref(db, `rooms/${roomCode}`);

  
  
//   const newRoom = {
//     size: size,
//     palette: ["#ffffff","#000000","#ff0000","#00ff00","#0000ff"], // example
//     pixels: {} // empty sparse map
//   };

//   return set(roomRef, newRoom)
//     .then(() => console.log(`Room ${roomCode} created!`))
//     .catch(err => console.error("Error creating room:", err));
// }