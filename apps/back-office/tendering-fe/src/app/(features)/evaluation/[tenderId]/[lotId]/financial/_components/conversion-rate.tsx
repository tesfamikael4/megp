'use client';

import {
  useCreateConversionRateMutation,
  useGetConversionRateByLotIdQuery,
} from '@/store/api/tendering/bid-price-evaluation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Box,
  Flex,
  Group,
  TextInput,
  LoadingOverlay,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { ExpandableTable, Section, logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const conversionDateSchema: ZodType<any> = z.object({
  dateOfConversion: z.date({
    required_error: 'Date of Conversion is required',
  }),
  source: z.string().min(1, 'Source of Conversion is required'),
});

export const ConversionRate = () => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(conversionDateSchema),
  });
  const [conversionData] = useState([
    {
      local_currency: '1 ETB',
      foreign_currency: 'USD',
      conversion_rate: 0.004,
    },
    {
      local_currency: '1 ETB',
      foreign_currency: 'EUR',
      conversion_rate: 0.004,
    },
  ]);
  const config = {
    minHeight: 100,
    columns: [
      {
        accessor: 'local_currency',
      },
      {
        accessor: 'conversion_rate',
        render: (record) => {
          return <TextInput leftSection={record.foreign_currency} disabled />;
        },
      },
    ],
  };

  const { lotId } = useParams();
  const [hasDateOfConversion, setHasDateOfConversion] = useState(false);

  //rtk
  const { data: dateOfConversionRate, isLoading: isGettingConversionRate } =
    useGetConversionRateByLotIdQuery(lotId);
  const [createConversionDate, { isLoading: isCreating }] =
    useCreateConversionRateMutation();

  const onDateSubmit = async (data) => {
    try {
      await createConversionDate({ ...data, lotId }).unwrap();
      notify('Success', 'Created successfully');
    } catch (err) {
      if (err.status == 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
    logger.log({ data });
  };

  useEffect(() => {
    if (dateOfConversionRate && dateOfConversionRate?.items?.length > 0) {
      setHasDateOfConversion(dateOfConversionRate.items.length !== 0);
      const temp = dateOfConversionRate.items[0];
      reset({
        dateOfConversion: new Date(temp.dateOfConversion),
        source: temp.source,
      });
    }
  }, [dateOfConversionRate, isGettingConversionRate]);
  return (
    <Section className="mt-2" title="Conversion Rate" collapsible={false}>
      <Box pos="relative">
        <LoadingOverlay visible={isGettingConversionRate} />

        <Flex gap={10}>
          <Controller
            name="dateOfConversion"
            control={control}
            render={({ field }) => (
              <DateInput
                label="Date of Conversion"
                className="w-full"
                {...field}
                error={errors?.dateOfConversion?.message?.toString()}
                disabled={hasDateOfConversion}
              />
            )}
          />
          <TextInput
            label="Source of Conversion"
            className="w-full"
            {...register('source')}
            error={errors?.source?.message?.toString()}
            disabled={hasDateOfConversion}
          />
        </Flex>
        <Group className="mt-2" justify="end">
          <Button
            onClick={handleSubmit(onDateSubmit)}
            loading={isCreating}
            disabled={hasDateOfConversion}
          >
            Save
          </Button>
        </Group>

        {hasDateOfConversion && (
          <Box>
            <Box className="mt-2">
              <ExpandableTable config={config} data={conversionData} />
            </Box>
            <Group justify="end" className="mt-2">
              <Button>Save</Button>
            </Group>
          </Box>
        )}
      </Box>
    </Section>
  );
};
