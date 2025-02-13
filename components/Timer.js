"use client";

import React, { useState, useEffect } from "react";
import { AlarmBoldDuotone } from "solar-icons";

const Timer = ({ duration, totalDuration, startTime, onTimeUp }) => {
  const [endTime] = useState(() => {
    if (duration) {
      return Date.now() + duration * 60 * 1000;
    }
    if (totalDuration && startTime) {
      return startTime + totalDuration * 60 * 1000;
    }
    return null;
  });

  const [timeLeft, setTimeLeft] = useState(
    duration ? duration * 60 : totalDuration * 60
  );
  const WARNING_THRESHOLD = 30;

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

      if (remaining <= 0) {
        onTimeUp();
        return 0;
      }

      return remaining;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeUp]);

  if (!duration && !totalDuration) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= WARNING_THRESHOLD;

  return (
    <div
      className={`font-black text-base md:bg-white/70 md:backdrop-blur-md md:shadow md:shadow-slate-200 px-6 py-6 rounded-full flex items-center gap-1
        ${isWarning ? "animate-pulse md:bg-red-100 text-red-600" : ""}
        transition-colors duration-300`}
    >
      <AlarmBoldDuotone width={19} height={20} />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default Timer;
