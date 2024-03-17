import "./styles/app.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Board from "./pages/Board";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/:id" element={<Board />} />
          <Route
            path="*"
            element={<Navigate to={`${(+new Date()).toString(16)}`} replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
