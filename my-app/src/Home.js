import React from "react";
import "./Home.css"; // import the stylesheet


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiDixs8VRwm5PJyvJic8puhJTMwzb5ESA",
  authDomain: "drawcmu-3daa1.firebaseapp.com",
  projectId: "drawcmu-3daa1",
  storageBucket: "drawcmu-3daa1.firebasestorage.app",
  messagingSenderId: "181826924059",
  appId: "1:181826924059:web:96d14b5f07f97abb1b52be",
  measurementId: "G-RXM5255S3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


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
    // Replace with navigation logic
    console.log("Joining room:", roomCode, "as", username);
  };

  render() {
    return (
      <div className="home-container">
        <div className="home-card">
          <h1>🎨 r/place Mini</h1>
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

export default Home;
