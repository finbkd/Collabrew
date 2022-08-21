import "./App.css";
import { Route, Routes } from "react-router-dom";
import CreateRoom from "./pages";
import Room from "./pages/room";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateRoom />} exact />
      <Route path="/:id" element={<Room />} exact />
    </Routes>
  );
}

export default App;
