import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
//import "bootstrap/dist/css/bootstrap.min.css"; // ⭐ ADD THIS
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
