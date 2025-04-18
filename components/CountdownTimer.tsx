"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium mb-2 text-primary-light">
        Next song in
      </h3>
      <div className="flex justify-center space-x-4">
        <div className="flex flex-col items-center">
          <div className="bg-primary-green-light/60 text-primary-light border border-primary-light/20 rounded-md px-3 py-2 text-xl font-bold">
            {pad(timeLeft.hours)}
          </div>
          <span className="text-xs mt-1 text-primary-light/70">hours</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-primary-green-light/60 text-primary-light border border-primary-light/20 rounded-md px-3 py-2 text-xl font-bold">
            {pad(timeLeft.minutes)}
          </div>
          <span className="text-xs mt-1 text-primary-light/70">minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-primary-green-light/60 text-primary-light border border-primary-light/20 rounded-md px-3 py-2 text-xl font-bold">
            {pad(timeLeft.seconds)}
          </div>
          <span className="text-xs mt-1 text-primary-light/70">seconds</span>
        </div>
      </div>
    </div>
  );
}
