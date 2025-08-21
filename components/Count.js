"use client";
import { useEffect, useState } from "react";

export default function AnimatedCount({ target, loading }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval;

    if (loading) {
      // Fake increment while waiting
      let step = 1;
      interval = setInterval(() => {
        setCount((prev) => prev + step);
        step = Math.max(0.1, step - 0.1); // reduce step size
      }, 1000);
    } else if (target !== undefined && target !== null) {
      // Smooth catch-up once target arrives
      const animate = () => {
        setCount((prev) => {
          if (prev >= target) {
            cancelAnimationFrame(interval);
            return target;
          }
          const diff = target - prev;
          const increment = Math.max(1, diff / 15); // adaptive catch-up
          return prev + increment;
        });
        interval = requestAnimationFrame(animate);
      };
      interval = requestAnimationFrame(animate);
    }

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(interval);
    };
  }, [loading, target]);

  return <span>{Math.floor(count)}+</span>;
}
