import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import ContextWrapper from "./context/ContextWrapper";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <ContextWrapper>
        <App />
        <NotificationContainer />
      </ContextWrapper>
    </React.StrictMode>
  </BrowserRouter>
);
