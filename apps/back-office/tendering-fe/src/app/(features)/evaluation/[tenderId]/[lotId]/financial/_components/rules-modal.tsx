'use client';

import { Box, Button, Group, Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ExpressionBuilder } from './expression-builder';
import { ZodType, z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { logger, notify } from '@megp/core-fe';
import {
  useCreateRuleEquationMutation,
  useGetRulesByLotIdQuery,
} from '@/store/api/tendering/bid-price-evaluation';
import { useParams } from 'next/navigation';

const ruleSchema: ZodType<any> = z.object({
  label: z.string({
    required_error: 'Rule is required',
  }),
  type: z.string({
    required_error: 'Type is required',
  }),
  formula: z.array(z.string({ required_error: 'Formula is required' })),
});

export const RulesModal = ({ close }: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(ruleSchema),
  });
  const rulesList = [
    'Tax',
    'Vat',
    'Preferential Margin',
    // { name: 'Rule 4', id: 4 },
  ];

  const [rule, setRule] = useState<any | undefined>(undefined);
  const { lotId } = useParams();
  const [expressions, setExpressions] = useState<any[]>([
    {
      id: 'unit_price',
      name: 'unit_price',
      formula: '1+1',
    },
  ]);

  ///rtk
  const [createRule, { isLoading }] = useCreateRuleEquationMutation();
  const { data: rules } = useGetRulesByLotIdQuery(lotId);

  const onSubmit = async (data) => {
    const castedData = {
      // ...data,
      name: data.label,
      type: data.type,
      lotId,
      representation: data.formula
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
    try {
      await createRule(castedData).unwrap();
      notify('Success', 'Created successfully');
      close();
    } catch (err) {
      if (err.status === 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  useEffect(() => {
    if (rules) {
      const temp = [
        {
          id: 'unit_price',
          name: 'unit_price',
          formula: '1+1',
        },
        ...rules.items.map((e) => ({
          id: e.id,
          name: e.name,
          formula: e.representation,
        })),
      ];

      setExpressions(temp);
    }
  }, [rules]);
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
            data={rulesList}
            onChange={(val, option) => {
              if (val == null) {
                onChange(null);
                setRule(undefined);
              } else {
                onChange(val);
                setRule(val);
              }
            }}
          />
        )}
      />

      {rule && (
        <Box>
          <Controller
            control={control}
            name="type"
            render={({ field: { name, value, onChange } }) => (
              <Select
                name={name}
                value={value}
                label="Type"
                withAsterisk
                data={['TAXES', 'ADDITION', 'DEDUCTION']}
                onChange={onChange}
                error={errors?.type?.message?.toString()}
              />
            )}
          />
          <Controller
            control={control}
            name="formula"
            render={({ field: { value, onChange } }) => (
              <ExpressionBuilder
                // expressions={expressions}
                expressions={expressions}
                setValue={(val) => onChange(val)}
                value={value ?? []}
              />
            )}
          />

          <Group justify="end" className="mt-2">
            <Button onClick={handleSubmit(onSubmit)} loading={isLoading}>
              Save
            </Button>
          </Group>
        </Box>
      )}
    </>
  );
};
