import { Checkbox, Group } from '@mantine/core';
import React from 'react';
interface MultiCheckBoxProps {
  data: { value: string; label: string; disabled: boolean }[];
  [key: string]: any;
}
const MultiCheckBox: React.FC<MultiCheckBoxProps> = ({ data, ...props }) => {
  return (
    <Checkbox.Group withAsterisk {...props}>
      <Group mt="xs">
        {data.map((d, index) => (
          <Checkbox
            key={index}
            value={d.value}
            label={d.label}
            disabled={d.disabled}
          />
        ))}
      </Group>
    </Checkbox.Group>
  );
};

export default MultiCheckBox;
