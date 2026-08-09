import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookDetail from "./pages/BookDetail";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books/:id" element={<BookDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
