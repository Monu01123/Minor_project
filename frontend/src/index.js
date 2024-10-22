import reportWebVitals from "./reportWebVitals";
import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./Context/auth.js";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create a root

root.render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
