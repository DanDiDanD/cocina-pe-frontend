import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-credit-cards/es/styles-compiled.css';
import "./index.scss";
import App from "./App";
import AuthProvider from "./providers/AuthContext";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
