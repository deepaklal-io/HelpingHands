import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RequestDetails from "./pages/RequestDetails";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/donor" element={
          <ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/request/:id" element={
          <ProtectedRoute><RequestDetails /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
