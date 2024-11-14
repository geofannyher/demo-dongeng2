import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import StarVideo2 from "./pages/Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route index element={<Star />} /> */}
        <Route index element={<StarVideo2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
