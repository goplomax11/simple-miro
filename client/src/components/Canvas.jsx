import React, { useEffect, useRef, useState } from "react";
import "../styles/canvas.scss";
import { observer } from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Input } from "@mui/material";
import { useParams } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Canvas = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const canvasRef = useRef();
  const inputRef = useRef();
  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    console.log(canvasState.username)
    if(canvasState.username) {
      const socket = new WebSocket("ws://localhost:5000/");
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id)
      toolState.setTool(new Brush(canvasState.canvas, socket, params.id));
      socket.onopen = () => {
        console.log("Connected");
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: "connection"
        }))
      }

      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            console.log(`User ${msg.username} connected`)
            break
          case "draw":
            drawHandler(msg);
            break
        }
      }
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext("2d");
    console.log(figure);
    console.log(ctx)
    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y)
        break;
        case "finish":
          ctx.beginPath();
          break;
    
      default:
        break;
    }
  }

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  };

  const connectHandler = () => {
    console.log(inputRef)
    canvasState.setUsername(inputRef.current.value);
    setIsModalOpen(false);
  };

  return (
    <div className="canvas">
      <Modal
        open={isModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter your username
          </Typography>
          <Input  inputProps={{ref:inputRef}} placeholder="Username..." />
          <Button onClick={connectHandler}>Sigh-in</Button>
        </Box>
      </Modal>
      <canvas
        onMouseDown={mouseDownHandler}
        ref={canvasRef}
        height={600}
        width={800}
      ></canvas>
    </div>
  );
});

export default Canvas;
