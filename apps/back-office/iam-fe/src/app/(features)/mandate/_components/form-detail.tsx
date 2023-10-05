import { Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationSector } from '@/models/organization-sector';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { useReadQuery } from '../_api/mandate.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

export function FormDetail({ mode }: FormDetailProps) {
  const { reset, register } = useForm({});

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
