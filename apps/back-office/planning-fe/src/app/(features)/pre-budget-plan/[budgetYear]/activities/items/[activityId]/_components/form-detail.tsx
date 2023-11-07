'use client';

import { PreBudgetPlanItems } from '@/models/pre-budget-plan-items';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Flex,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const itemSchema: ZodType<Partial<PreBudgetPlanItems>> = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  unitPrice: z.number().min(1, { message: 'Estimated unit price is required' }),
  currency: z.string({
    required_error: 'Currency is required',
  }),
  quantity: z.number().min(1, { message: 'Quantity is required' }),
  UoM: z.string({
    required_error: 'Unit of measurement is required',
  }),
});

export const FormDetail = ({ mode }: FormDetailProps) => {
  const {
    handleSubmit,
    // reset,
    formState: { errors },
    control,
    // setValue,
    register,
  } = useForm<PreBudgetPlanItems>({
    resolver: zodResolver(itemSchema),
  });

  const [specification] = useState({
    General: [
      { key: 'Commodity', value: '	3001011102 | Chair' },
      {
        key: 'Classification',
        value: 'Furnishing & Fixture / Furnishing / Chair',
      },
      { key: 'Item Code	', value: '300101102.0005A' },
    ],
  });

  //specification
  const Specification = () => {
    const [addValueFor, setAddValueFor] = useState('');
    return (
      <>
        <Text size="sm" fw={500}>
          Specification
        </Text>

        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Tbody>
            {Object.keys(specification).map((key) => (
              <>
                <Table.Tr>
                  <Table.Td className="bg-slate-200 font-semibold">
                    {key}
                  </Table.Td>
                  <Table.Td className="bg-slate-200"></Table.Td>
                  <Table.Td className="bg-slate-200">
                    <IconPlus
                      className="ml-auto cursor-pointer"
                      onClick={() => setAddValueFor(key)}
                    />
                  </Table.Td>
                </Table.Tr>
                {specification[key].map((spec) => {
                  return (
                    <>
                      <Table.Tr>
                        <Table.Td className="bg-slate-200 font-semibold">
                          {spec.key}
                        </Table.Td>
                        <Table.Td>{spec.value}</Table.Td>
                        <Table.Td>
                          <IconTrash className="ml-auto cursor-pointer" />
                        </Table.Td>
                      </Table.Tr>
                    </>
                  );
                })}
                {addValueFor == key && (
                  <Table.Tr>
                    <Table.Td className="bg-slate-200 ">
                      <TextInput placeholder="Add specification title" />
                    </Table.Td>
                    <Table.Td>
                      <TextInput placeholder="Add specification detail" />
                    </Table.Td>
                    <Table.Td>
                      <Text className="ml-auto cursor-pointer">Add</Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </>
            ))}
          </Table.Tbody>
        </Table>
      </>
    );
  };

  //event handeler
  const onUpdate = (data) => {
    logger.log(data);
  };
  const onError = (err) => {
    logger.log(err);
  };
  return (
    <Stack>
      <Table highlightOnHover withTableBorder withColumnBorders>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold">
              Commodity
            </Table.Td>
            <Table.Td>3001011102 | Chair</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold">
              Classification
            </Table.Td>
            <Table.Td>Furnishing & Fixture / Furnishing / Chair</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold">
              Item Code
            </Table.Td>
            <Table.Td>300101102.0005A</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Textarea
        label="Description"
        withAsterisk
        {...register('description')}
        error={errors?.description?.message as string}
        autosize
        minRows={2}
        maxRows={10}
      />
      <Flex gap="md">
        <Controller
          name="unitPrice"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              name={name}
              value={value}
              onChange={(data) => onChange(data as number)}
              withAsterisk
              label="Estimated Unit Price"
              thousandSeparator=","
              error={errors?.unitPrice?.message}
            />
          )}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <Select
              label="Currency"
              data={['USD', 'EUR']}
              withAsterisk
              name={name}
              value={value}
              onChange={onChange}
              error={errors?.currency?.message}
            />
          )}
        />
        <Controller
          name="quantity"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              name={name}
              value={value}
              onChange={(data) => onChange(data as number)}
              withAsterisk
              label="Quantity"
              thousandSeparator=","
              error={errors?.quantity?.message}
            />
          )}
        />

        <Controller
          name="UoM"
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              label="Unit of Measurement"
              data={['Peace', 'Kilo gram']}
              withAsterisk
              error={errors?.UoM?.message}
            />
          )}
        />
      </Flex>
      <Specification />

      <EntityButton
        mode={mode}
        onUpdate={handleSubmit(onUpdate, onError)}
        onDelete={handleSubmit(onUpdate)}
      />
    </Stack>
  );
};
