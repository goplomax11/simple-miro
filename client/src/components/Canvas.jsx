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
import axios from "axios";

const styles = {
  modalBox: {
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
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
};

const Canvas = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const canvasRef = useRef();
  const inputRef = useRef();
  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext("2d");
    axios.get(`http://localhost:5000/image?id=${params.id}`).then((response) => {
      const img = new Image();
      img.src = response.data;
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      };
    });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket("ws://localhost:5000/");
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasState.canvas, socket, params.id));
      socket.onopen = () => {
        console.log("Connected");
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };

      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            console.log(`User ${msg.username} connected`);
            break;
          case "draw":
            drawHandler(msg);
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext("2d");
    console.log(figure);
    console.log(ctx);
    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case "finish":
        ctx.beginPath();
        break;

      default:
        break;
    }
  };

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  };

  const mouseUpHandler = () => {
    axios
      .post(`http://localhost:5000/image?id=${params.id}`, {
        img: canvasRef.current.toDataURL(),
      })
      .then((response) => console.log(response.data))
      .catch((e) => console.log(e));
  };

  const connectHandler = () => {
    canvasState.setUsername(inputRef.current.value);
    setIsModalOpen(false);
  };

  return (
    <div className="canvas">
      <Modal open={isModalOpen} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{ ...styles.modalBox, width: 400 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter your username
          </Typography>
          <Box sx={{ ...styles.inputWrapper }}>
            <Input inputProps={{ ref: inputRef }} placeholder="Username..." />
            <Button variant="contained" onClick={connectHandler}>
              Sigh-in
            </Button>
          </Box>
        </Box>
      </Modal>
      <canvas
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        ref={canvasRef}
        height={600}
        width={800}
      ></canvas>
    </div>
  );
});

export default Canvas;
