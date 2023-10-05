import { Stack, TextInput, Textarea } from '@mantine/core';

import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mandate } from '@/models/mandate';
import { useReadQuery } from '../_api/my-mandate.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useForm } from 'react-hook-form';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

export function FormDetail({ mode }: FormDetailProps) {
  const {
    reset,

    register,
  } = useForm({});

  const { id } = useParams();

  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        description: selected?.description,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack>
      <TextInput withAsterisk label="Name" {...register('name')} required />

      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
      />
    </Stack>
  );
}
