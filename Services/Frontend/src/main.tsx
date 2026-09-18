import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";

// Проверяем, запущено ли в Electron
const isElectron =
  window && window.process && window.process.type === "renderer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isElectron ? (
      // ✅ В Electron используем HashRouter
      <HashRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </HashRouter>
    ) : (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    )}
  </React.StrictMode>,
);
