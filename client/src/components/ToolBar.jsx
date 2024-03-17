import React from "react";
import "../styles/toolBar.scss";
import { observer } from "mobx-react-lite";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";

const ToolBar = observer(() => {

  return (
    <div className="tool-bar">
      <button className="tool-bar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas))}/>
      <button className="tool-bar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas))}/>
      <button className="tool-bar__btn circle" />
      <button className="tool-bar__btn eraser" />
      <button className="tool-bar__btn" type="color" />
      <button className="tool-bar__btn undo" />
      <button className="tool-bar__btn redo" />
      <button className="tool-bar__btn save" />
    </div>
  );
});

export default ToolBar;
