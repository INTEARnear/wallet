import React from "react";
import { createRoot } from "react-dom/client";
import Overlays from "./Overlays";

const test = document.createElement("div");
document.body.appendChild(test);

const root = createRoot(test);
root.render(<Overlays />);

let currentRipple: HTMLSpanElement | null = null;

function createRipple(event: TouchEvent, element: HTMLElement) {
    element.querySelectorAll('.ripple-circle').forEach(ripple => ripple.remove());

    const rect = element.getBoundingClientRect();

    const x = (event.touches?.[0] || event).clientX - rect.left;
    const y = (event.touches?.[0] || event).clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-circle';

    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.appendChild(ripple);

    currentRipple = ripple;
}

function handleTouchStart(event) {
    const element = event.target?.closest('a:not(.no-mobile-ripple), button:not(.no-mobile-ripple), .mobile-ripple');
    if (!element) return;
    if (currentRipple) {
        currentRipple.remove();
        currentRipple = null;
    }
    createRipple(event, element);
}

function handleContextMenu(event) {
    const element = event.target.closest('a:not(.no-mobile-ripple), button:not(.no-mobile-ripple), .mobile-ripple');
    if (!element) return;

    const activeRipple = element.querySelector('.ripple-circle');
    if (activeRipple) {
        event.preventDefault();
        event.stopPropagation();
    }
}

function handleTouchEnd() {
    if (currentRipple) {
        const ripple = currentRipple;
        currentRipple = null;
        ripple.style.opacity = '0';
        setTimeout(() => {
            ripple.remove();
        }, 5000);
    }
}

document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('contextmenu', handleContextMenu, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: true });
