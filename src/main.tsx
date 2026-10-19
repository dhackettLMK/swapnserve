import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureReferrer } from "./lib/signupContext";

captureReferrer();

createRoot(document.getElementById("root")!).render(<App />);
