import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Board.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import CanvasBoard from "./Canvas";
import { useState } from "react";
import { useRef } from "react";

export function Player(db, username){
    const userRef = ref(db, `rooms/${roomCode}/users/${username}`);
}