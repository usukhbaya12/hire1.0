"use client";

import { useEffect } from "react";

const Zoom = () => {
  useEffect(() => {
    const handleGestureStart = (e) => {
      e.preventDefault();
      document.body.style.zoom = 0.99;
    };

    const handleGestureChange = (e) => {
      e.preventDefault();
      document.body.style.zoom = 0.99;
    };

    const handleGestureEnd = (e) => {
      e.preventDefault();
      document.body.style.zoom = 0.99;
    };

    document.addEventListener("gesturestart", handleGestureStart);
    document.addEventListener("gesturechange", handleGestureChange);
    document.addEventListener("gestureend", handleGestureEnd);

    return () => {
      document.removeEventListener("gesturestart", handleGestureStart);
      document.removeEventListener("gesturechange", handleGestureChange);
      document.removeEventListener("gestureend", handleGestureEnd);
    };
  }, []);

  return null;
};

export default Zoom;
