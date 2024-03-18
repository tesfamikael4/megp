import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Stack, Textarea } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

interface PerformanceInterface {
  taxAndDuties: string;
}

export default function Performance() {
  const PerformanceForm: ZodType<Partial<PerformanceInterface>> = z.object({
    taxAndDuties: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(PerformanceForm),
  });

  const onCreate = () => {
    logger.log('Delivarables');
  };
  return (
    <Stack>
      <Flex>
        <Textarea
          label="Tax and Duties"
          withAsterisk
          className="w-full"
          autosize
          minRows={2}
          error={
            errors?.taxAndDuties
              ? errors?.taxAndDuties?.message?.toString()
              : ''
          }
          {...register('taxAndDuties')}
        />
      </Flex>
      <EntityButton mode={'new'} onCreate={handleSubmit(onCreate)} />
    </Stack>
  );
}
