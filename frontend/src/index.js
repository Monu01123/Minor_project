import reportWebVitals from "./reportWebVitals";
import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App/App.js";
import { AuthProvider } from "./Context/auth.js";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create a root

root.render(
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

reportWebVitals();
