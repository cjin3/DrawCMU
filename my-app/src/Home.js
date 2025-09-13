import React from "react";
import "./Home.css"; // import the stylesheet

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
