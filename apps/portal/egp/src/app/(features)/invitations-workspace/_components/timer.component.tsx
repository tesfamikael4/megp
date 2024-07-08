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
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours} hrs : ${formattedMinutes} mins : ${formattedSeconds} secs`;
  };

  return <div>{formatTime(timeLeft)}</div>;
};
