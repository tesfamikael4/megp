import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Button, Stack } from '@mantine/core';
import { logger } from '@megp/core-fe';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  name: z.string(),
  description: z.string(),
});

type formSchema = z.infer<typeof schema>;

export default function FormDetail({ mode }: { mode: 'update' | 'new' }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<formSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    logger.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          {...register('name')}
          error={errors?.name?.message}
        />
        <TextInput
          label="Description"
          {...register('description')}
          error={errors?.description?.message}
        />
        <Button type="submit" className="ml-auto">
          Save
        </Button>
      </Stack>
    </form>
  );
}
