import { Routes, Route, HashRouter } from "react-router-dom";
import './App.css';
import Home from "./Home";
import Board from "./Board";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draw/:roomCode" element={<Board />} />
        
      </Routes>
    </HashRouter>
  );
}

export default App;
