'use client';

import { useEffect, useState } from 'react';

const getTimeDifference = (date1: Date, date2: Date) =>
  Math.floor((date2.getTime() - date1.getTime()) / 1000);

// Timer component
export const Timer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState(
    getTimeDifference(new Date(), targetDate),
  );

  useEffect(() => {
    if (timeLeft == 0) {
      location.reload();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(getTimeDifference(new Date(), targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetDate, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${formattedMinutes} mins: ${formattedSeconds} secs`;
  };

  return <div>{formatTime(timeLeft)}</div>;
};
