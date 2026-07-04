import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SchoolDetail from "./pages/SchoolDetail";
import Templates from "./pages/Templates";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schools/:id" element={<SchoolDetail />} />
        <Route path="/templates" element={<Templates />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
