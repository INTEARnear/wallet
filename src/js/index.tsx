import React from "react";
import { createRoot } from "react-dom/client";
import Overlays from "./Overlays";

const test = document.createElement("div");
document.body.appendChild(test);

const root = createRoot(test);
root.render(<Overlays />);
