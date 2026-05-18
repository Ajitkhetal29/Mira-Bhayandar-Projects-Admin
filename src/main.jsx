import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AppConetxtProvider from "./context/context.jsx";

  createRoot(document.getElementById("root")).render(
    <HashRouter>
      <AppConetxtProvider>
        <App />
      </AppConetxtProvider>
    </HashRouter>
  );
