import React, { useRef, useEffect, useState } from "react";

export default function CanvasBoard({ width = 512, height = 512, draw }) {
  const canvasRef = useRef(null);
// mouse click function
  //draw function 

  //erase function

  //update function

  
  

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ccc" }}
    />
  );
}