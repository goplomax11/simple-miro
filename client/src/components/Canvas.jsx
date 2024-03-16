import React, { useEffect, useRef } from "react";
import "../styles/canvas.scss";
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";

const Canvas = observer(() => {
  const canvasRef = useRef();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    console.log(canvasRef)
  }, []);
  
  return (
    <div className="canvas">
      <canvas ref={canvasRef} height={600} width={800}></canvas>
    </div>
  );
});

export default Canvas;
