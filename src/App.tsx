import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Star from "./pages/star";
import StarVideo2 from "./pages/Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Star />} />
        <Route path="/video" element={<StarVideo2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
