export function convertToObject(input: any, keyToCheck: string) {
  const result = {};
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const keys = key.split('.');
      let current: any = result;
      keys.forEach((subKey, index) => {
        if (index === keys.length - 1) {
          current[subKey] = '';
        } else {
          current[subKey] = current[subKey] || {};
          current = current[subKey];
        }
      });
    }
  }
  return keyToCheck in result;
}

export function formGetLatestValues(
  latestObject: object,
  initialObject: object,
) {
  const copylatestObject = { ...latestObject };
  // Iterate over Object 1 and update fields in copylatestObject where Object 1 has non-empty values
  for (const key in initialObject) {
    if (initialObject[key] !== null && typeof initialObject[key] === 'object') {
      // Handle nested objects (e.g., basicRegistration)
      for (const subKey in initialObject[key]) {
        if (initialObject[key][subKey] !== '') {
          copylatestObject[key][subKey] = initialObject[key][subKey];
        }
      }
    } else {
      // Handle top-level fields
      if (initialObject[key] !== '') {
        copylatestObject[key] = initialObject[key];
      }
    }
  }

  return copylatestObject;
}

//dev helper functions
import { setCookie, hasCookie, getCookie } from 'cookies-next';

export function generateAndSaveKey(source = '') {
  // Check if a key is already stored in localStorage
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  if (source === 'button') {
    // Generate a random key
    const randomKey = uuidv4(); // Adjust the key generation as needed

    setCookie('userId', randomKey);

    // Return the generated key
    return randomKey;
  } else if (!hasCookie('userId')) {
    const randomKey = uuidv4(); // Adjust the key generation as needed
    setCookie('userId', randomKey);

    // Return the generated key
    return randomKey;
  } else {
    // Key already exists in localStorage, return it
    return getCookie('userId');
  }
}

export const transformCategoryListData = (
  inputData: any,
  businessArea: string,
) =>
  inputData
    .filter(
      (item) => item.businessArea.toLowerCase() === businessArea.toLowerCase(),
    )
    .map((item) => ({
      value: item.id,
      label: item.description,
    }));
export const transformCategoryPriceRange = (
  inputData: any,
  businessArea: string,
) =>
  inputData
    .filter(
      (item) => item.businessArea.toLowerCase() === businessArea.toLowerCase(),
    )
    .map((item) => ({
      value: item.id,
      label: `${item.valueFrom} to ${item.valueTo} ${item.currency}`,
    }));
export const getLabelByValue = (
  data: {
    value: string;
    label: string;
  }[],
  targetValue: string,
): string => {
  for (const item of data) {
    if (item.value === targetValue) {
      return item.label;
    }
  }
  return ''; // Return null if the value is not found in the array
};
