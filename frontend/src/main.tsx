import { createRoot } from "react-dom/client";
import "./styles/index.css";
import './instrumentation'
import App from "./App";
import { TodoProvider } from "./context/TodoContext";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <TodoProvider>
    <Toaster />
    <App />
  </TodoProvider>
);
