export function processCompanyName(name: string): {
  initials: string;
  color: string;
} {
  const words: string[] = name?.split(' ');
  let initials = '';

  if (words?.length === 1) {
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
