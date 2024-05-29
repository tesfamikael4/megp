import { Select } from '@mantine/core';

export const UomInput = ({ item }) => {
  return (
    <Select data={item?.uoms} label="UOM" placeholder="Select UOM" required />
  );
};
