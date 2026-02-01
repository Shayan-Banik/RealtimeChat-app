import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
