import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Contextshare from "./context/Contextshare.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="837194104629-allvnpra08gsv6jj972oodf9effccghn.apps.googleusercontent.com">
        <Contextshare>
          <App />
        </Contextshare>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
