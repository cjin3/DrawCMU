import { Routes, Route, HashRouter } from "react-router-dom";
import './App.css';
import Home from "./Home";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
