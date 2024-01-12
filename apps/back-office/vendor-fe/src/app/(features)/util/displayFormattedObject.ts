type ObjectType = {
  [key: string]: any;
};

export function displayFormattedObject(
  obj: ObjectType,
  format: any = {},
): string {
  return Object.keys(obj)
    .map((key) => {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        // If the property is an object, recursively call the function
        return displayFormattedObject(obj[key], format[key]);
      } else {
        // If the property is not an object, format it based on the provided format
        if (format[key] === 'amount+currency') {
          return `${obj[key].amount} ${obj[key].currency}`;
        } else {
          // Default behavior: just return the original value
          return obj[key];
        }
      }
    })
    .join(' ');
}
