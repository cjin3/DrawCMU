import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import CanvasBoard from "./Canvas";
import { useState } from "react";
import { useRef } from "react";



export function Player(x, y, db, roomCode, username) {


    // console.log("mouse at: " + x + ", " + y);
    console.log("roomcode: " + roomCode, "username: " + username);
    let latestPos = { x: x, y: y };
    const interval = setInterval(() => {
        const { x, y } = latestPos;

        // bounds check
        if (x < 0 || y < 0 || x >= 128 || y >= 128) return;

        // database reference
        //const userRef = ref(db, `rooms/${roomCode}/users/${username}/coords`);
        //set(userRef, { x, y }).catch(err => console.error(err));
        // console.log(`Updated position for ${username} to (${x}, ${y}) in room ${roomCode}`);
    }, 200); // update every 200ms

    // cleanup
    return () => clearInterval(interval);

}

