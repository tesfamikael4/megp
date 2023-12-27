export function processCompanyName(name: string): {
  initials: string;
  color: string;
} {
  const words: string[] = name.split(' ');
  let initials = '';

  if (words.length === 1) {
    initials = name.substring(0, 2).toUpperCase();
  } else {
    initials = words
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  const color: string = getUniqueColor(name);
  return { initials, color };
}

function getUniqueColor(name: string): string {
  // For example, using a simple hashing method:
  const hashCode = (str: string): number => {
    let hash = 0;
    if (str.length === 0) {
      return hash;
    }
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  const colorCode: number = hashCode(name) % 0xffffff; // Limit to a range for RGB values
  return `#${('00000' + colorCode.toString(16)).slice(-6)}`; // Return a hex color code
}

//Date formatter
export function formatDateTimeFromString(dateString: string): string | null {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null; // Invalid date string
  }

  const months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day: number = date.getDate();
  const month: string = months[date.getMonth()];
  const year: number = date.getFullYear();
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const period: string = hours >= 12 ? 'PM' : 'AM';
  const twelveHourFormat: number = hours % 12 || 12; // Convert 24-hour to 12-hour format

  const formattedDate = `${day.toString().padStart(2, '0')}-${month}-${year}`;
  const formattedTime = `${twelveHourFormat}:${minutes
    .toString()
    .padStart(2, '0')}${period}`;

  return `${formattedDate} ${formattedTime}`;
}
