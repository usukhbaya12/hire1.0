"use client";

import React, { useEffect, useState } from "react";

export default function ProgressSpinner({
  tip = "Тайлан боловсруулж байна...",
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += Math.random() * 5;
      if (current < 95) {
        setProgress(Math.floor(current));
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md z-[1000]">
      <div className="relative w-24 h-24 animate-pulse">
        <svg className="transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#4BB543"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * ((100 - progress) / 100)}
            fill="none"
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-md font-semibold text-gray-700">
          {progress}%
        </div>
      </div>
      {tip && <div className="mt-4 font-semibold text-gray-700">{tip}</div>}
    </div>
  );
}
