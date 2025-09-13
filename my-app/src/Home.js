import React from "react";
import "./Home.css"; // import the stylesheet


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);



const db = getDatabase(app);
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      username: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { roomCode, username } = this.state;
    if (!roomCode) return alert("Please enter a room code!");
    if (!username) return alert("Please enter a username!");

    set(ref(db, `rooms/${roomCode}/users/${username}`), {
      username,
      joinedAt: Date.now()
    })
    .then(() => {
      console.log({roomCode, username});

    })
    .catch((error) => {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please try again.");
    });
    console.log("Joining room:", roomCode, "as", username);

    get(ref(db, `rooms/${roomCode}/array`))
    .then((snapshot) => {
      console.log("looking for room array:", roomCode);
      if (snapshot.exists()) {
              console.log("Found array for room:", roomCode);

      }
      else{
        console.log("no array found, creating room:", roomCode);
        createRoom(roomCode);
      }
    })
    .catch((error) => {
      console.error(error)
    })

  };

  render() {
    return (
      <div className="home-container">
        <div className="home-card">
          <h1>🎨 DrawCMU</h1>
          <p>Enter a room code to join a canvas</p>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={this.state.username}
              onChange={this.handleChange}
              className="home-input"
            />
            <input
              type="text"
              name="roomCode"
              placeholder="Enter room code"
              value={this.state.roomCode}
              onChange={this.handleChange}
              className="home-input"
            />
            <button type="submit" className="home-button">
              Join Room
            </button>
          </form>
        </div>
      </div>
    );
  }
}

function createRoom(roomCode, size = 64) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  
  const newRoom = {
    size: size,
    palette: ["#ffffff","#000000","#ff0000","#00ff00","#0000ff"], // example
    pixels: {} // empty sparse map
  };

  return set(roomRef, newRoom)
    .then(() => console.log(`Room ${roomCode} created!`))
    .catch(err => console.error("Error creating room:", err));
}

export default Home;
