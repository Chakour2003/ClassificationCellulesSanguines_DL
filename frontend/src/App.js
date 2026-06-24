import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/landing.jsx";
import Home from "./components/home.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/predict" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}