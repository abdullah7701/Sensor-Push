import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <div className="min-h-screen">
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard setIsAuthenticated={setIsAuthenticated} />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;