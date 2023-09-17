import { useState } from 'react';

function useToggle(initialValue = false): [boolean, () => void] {
  // Create a state variable 'value' and its updater function 'setValue'
  const [value, setValue] = useState<boolean>(initialValue);

  // Define a function to toggle the value
  const toggle = (): void => {
    setValue((prevValue: boolean) => !prevValue);
  };

  return [value, toggle];
}

export default useToggle;
