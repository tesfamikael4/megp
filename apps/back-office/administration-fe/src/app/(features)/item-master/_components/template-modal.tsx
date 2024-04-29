import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  NumberInput,
  Select,
  Stack,
  TagsInput,
  TextInput,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { IconCirclePlus } from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { v4 } from 'uuid';
import { catagory, dataTypes } from './constants';

interface Specification {
  dataType: string;
  measurement?: string;
  displayName: string;
  defaultValue?: string | number | boolean | unknown;
  min?: number;
  max?: number;
  uom?: string[] | undefined;
  isRequired?: boolean;
  spec?: string;
  selectFrom?: any[];
}

export function Popup({
  close,
  add,
}: {
  setFormState?: any;
  close;
  add: any;
  id?: string;
}) {
  const itemSchema: ZodType<Specification> = z.object({
    dataType: z.string().min(1, { message: 'This is required' }),
    measurement: z.string().optional(),
    displayName: z.string().min(1, { message: 'This name is required' }),
    isRequired: z.boolean().default(false),
    min: z.number().optional(),
    max: z.number().optional(),
    uom: z.any().optional().default([]),
    spec: z.string().optional(),
    selectFrom: z.array(z.any()).optional().default([]),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    register,
  } = useForm<Partial<Specification>>({
    resolver: zodResolver(itemSchema),
  });
  const type = watch('dataType');
  const [defaultValue, setDefaultValue] = useState<any>();

  const onCreate = (data: Partial<Specification>) => {
    const newData = {
      ...data,
      key: v4(),
      uom: data.uom,

      validation: {
        isRequired: data.isRequired,
        min: data.min,
        max: data.max,
        type:
          data.dataType == 'singleSelect' || data?.dataType == 'multiSelect'
            ? 'array'
            : data.dataType,
        selectFrom: data.selectFrom,
        enum: data.selectFrom,
      },
      defaultValue:
        typeof defaultValue == 'number' && defaultValue !== undefined
          ? Number(defaultValue)
          : defaultValue,
    };

    add(newData);
    close();
  };
  const onError = (error: any) => {
    logger.error(error);
  };
  return (
    <Box>
      <Stack>
        <TextInput
          withAsterisk
          {...register('displayName')}
          label="Display Name"
          error={
            errors?.displayName ? errors?.displayName?.message?.toString() : ''
          }
        />

        <TextInput
          label="Measurement "
          {...register('measurement')}
          error={errors.measurement?.message as string}
        />
        <Controller
          name="uom"
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <TagsInput
              value={value}
              label="unit Of Measurement "
              {...register('uom')}
              error={errors.uom?.message as string}
              onChange={onChange}
              placeholder="press enter to submit measurement"
            />
          )}
        />

        <Controller
          name="dataType"
          control={control}
          defaultValue=""
          render={({ field: { onChange, name, value } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              data={dataTypes}
              label="Input type"
              withAsterisk
              className="w-full"
              error={errors.dataType?.message as string | undefined}
            />
          )}
        />

        {type == 'string' && (
          <TextInput
            label="Default Value"
            value={defaultValue}
            error={errors.defaultValue?.message as string}
            type={type}
            onChange={(e) => {
              setDefaultValue(e.target.value);
            }}
          />
        )}
        {type == 'number' && (
          <Controller
            name="defaultValue"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <NumberInput
                label="Default Value"
                value={value as number}
                error={errors.defaultValue?.message as string}
                onChange={onChange}
              />
            )}
          />
        )}

        {type === 'boolean' && (
          <Checkbox
            onChange={(e) => {
              setDefaultValue(e.target.checked);
            }}
            className="w-full mt-4 mb-2"
            label="Value"
          />
        )}
        {(type === 'singleSelect' || type === 'multiSelect') && (
          <Controller
            name="selectFrom"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <TagsInput
                value={value}
                withAsterisk
                onChange={onChange}
                label="Values to select from"
                placeholder="Press Enter to submit a value"
                allowDuplicates={false}
                error={errors.selectFrom?.message as string}
              />
            )}
          />
        )}

        <Controller
          name="isRequired"
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <Checkbox
              required
              checked={value}
              onChange={onChange}
              className="w-full mt-4 mb-2"
              label="IsRequired"
              error={errors.isRequired?.message as string}
            />
          )}
        />
        {(type == 'string' || type == 'number') && (
          <Flex gap={20}>
            <Controller
              name="min"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <NumberInput
                  label="Minimum"
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={errors.min?.message as string}
                />
              )}
            />
            <Controller
              name="max"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <NumberInput
                  label="Maximum"
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={errors.min?.message as string}
                />
              )}
            />
          </Flex>
        )}

        <Controller
          name="spec"
          control={control}
          defaultValue=""
          render={({ field: { onChange, name, value } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              data={catagory}
              label="Catagory"
              className="w-full"
              error={errors.spec?.message as string | undefined}
            />
          )}
        />

        <Group className="ml-auto m-2">
          <Button
            leftSection={<IconCirclePlus size={20} />}
            type="submit"
            onClick={handleSubmit(onCreate, onError)}
          >
            Add
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
