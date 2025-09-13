import React, { useState } from "react";
import "./Board.css";

export default function HueBar({ onColorSelect }) {
  const [hue, setHue] = useState(0);

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percent = Math.max(0, Math.min(y / rect.height, 1)); // clamp between 0–1
    const newHue = Math.round(percent * 360);
    setHue(newHue);

    const newColor = `hsl(${newHue}, 100%, 50%)`;
    onColorSelect(newColor);
  };

  return (
    <div className="hue-bar" onClick={handleClick}>
      <div
        className="hue-knob"
        style={{ top: `${(hue / 360) * 100}%` }}
      />
    </div>
  );
}