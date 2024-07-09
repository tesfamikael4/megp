export function timeAgo(dateInput: string | Date): string {
  const updatedAt = new Date(dateInput);
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - updatedAt.getTime();
  const minutesAgo = Math.floor(differenceInMilliseconds / 60000);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  if (daysAgo > 0) {
    return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else if (hoursAgo > 0) {
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (minutesAgo > 0) {
    return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}
