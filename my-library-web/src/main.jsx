import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookDetail from "./pages/BookDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
