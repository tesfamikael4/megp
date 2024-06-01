'use client';

import { Box, Button, Group, Select } from '@mantine/core';
import { useState } from 'react';
import { ExpressionBuilder } from './expression-builder';
import { ZodType, z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { logger } from '@megp/core-fe';

const ruleSchema: ZodType<any> = z.object({
  label: z.string({
    required_error: 'Rule is required',
  }),
  formula: z.array(z.string({ required_error: 'Formula is required' })),
});

export const RulesModal = () => {
  const { control, handleSubmit } = useForm<any>({
    resolver: zodResolver(ruleSchema),
  });
  const rulesList = [
    { name: 'Tax', id: 1 },
    { name: 'Vat', id: 2 },
    { name: 'Preferential Margin', id: 3 },
    // { name: 'Rule 4', id: 4 },
  ];
  const expressions = [
    {
      id: 'unit_price',
      name: 'unit_price',
      formula: '1+1',
    },
  ];
  const [rule, setRule] = useState<any | undefined>(undefined);

  const onSubmit = (data) => {
    const castedData = {
      ...data,
      formula: data.formula
        .map((f) => {
          if (['(', ')', '*', '-', '+'].includes(f) || Number(f)) {
            return f;
          }
          const name = expressions?.find((e) => e.id === f)?.name;
          if (name) return name;
          throw new Error(`${f} is not found`);
        })
        .join(' '),
    };
    logger.log({ castedData });
  };
  return (
    <>
      <Controller
        control={control}
        name="label"
        render={({ field: { name, value, onChange } }) => (
          <Select
            name={name}
            value={value}
            label="Select Rule "
            withAsterisk
            data={rulesList.map((rule) => ({
              label: rule.name,
              value: rule.id.toString(),
            }))}
            onChange={(val, option) => {
              if (val == null) {
                onChange(null);
                setRule(undefined);
              } else {
                onChange(val);
                setRule({ name: option.label, id: option.value });
              }
            }}
          />
        )}
      />

      {rule && (
        <Box>
          <Controller
            control={control}
            name="formula"
            render={({ field: { value, onChange } }) => (
              <ExpressionBuilder
                expressions={expressions}
                setValue={(val) => onChange(val)}
                value={value ?? []}
              />
            )}
          />

          <Group justify="end" className="mt-2">
            <Button onClick={handleSubmit(onSubmit)}>Save</Button>
          </Group>
        </Box>
      )}
    </>
  );
};
