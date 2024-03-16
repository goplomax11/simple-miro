import React from "react";

const ToolBar = () => {
  return (
    <div className="tool-bar">
        <div className="tool-bar-left">
            <div className="tool-bar-left-item">
                <div className="tool-bar-left-item-icon">
                    <i className="fas fa-bars"></i>
                </div>
                <div className="tool-bar-left-item-text">
                    <span>Menu</span>
                </div>
            </div>
        </div>
        <div className="tool-bar-right">
            <div className="tool-bar-right-item">
                <div className="tool-bar-right-item-icon">
                    <i className="fas fa-user"></i>
                </div>
                <div className="tool-bar-right-item-text">
                    <span>User</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ToolBar;
