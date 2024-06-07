import { Select } from '@mantine/core';
import { Controller } from 'react-hook-form';

export const CustomSelect = ({
  control,
  name,
  label,
  data,
  errors,
  disableFields,
  placeholder,
  defaultValue,
  actions,
}: {
  control: any;
  name: string;
  data: any[];
  label: string;
  placeholder?: string;
  errors: any;
  disableFields?: boolean;
  defaultValue?: any;
  actions?: (val: any) => void;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, name, onChange } }) => (
        <Select
          name={name}
          value={value?.toString()}
          onChange={(val) => {
            actions && actions(val!);
            onChange(val);
          }}
          label={label}
          data={data}
          className="w-full"
          withAsterisk
          placeholder={placeholder ?? ''}
          error={errors?.[name] ? errors?.[name]?.message?.toString() : ''}
          disabled={disableFields}
          defaultValue={defaultValue}
        />
      )}
    />
  );
};
