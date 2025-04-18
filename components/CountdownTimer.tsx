"use client";

import { useState, useEffect } from "react";
import { getTimeUntilNextDay, formatTimeUntilNext } from "../utils/dateUtils";

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilNextDay());

  useEffect(() => {
    // Update the countdown every second
    const interval = setInterval(() => {
      setTimeRemaining(getTimeUntilNextDay());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">Next song in</p>
      <p className="text-2xl font-mono font-bold">
        {formatTimeUntilNext(timeRemaining)}
      </p>
    </div>
  );
}
