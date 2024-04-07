import {
  Button,
  LoadingOverlay,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { useRegistrationMutation } from '../../procurement-notice/_api/register.api';

interface FormDetailProps {
  tenderId?: string;
}

export function TenderFormDetail({ tenderId }: FormDetailProps) {
  const tenderSchema: ZodType<Partial<{ password: string }>> = z.object({
    password: z
      .string()
      .min(1, { message: 'This field is required.' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[a-zA-Z]/, {
        message: 'Password must have at least one alphabet character',
      })
      .regex(/[0-9]/, { message: 'Password must have at least one number' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(tenderSchema),
  });

  const [registration, { isLoading: isRegistering }] =
    useRegistrationMutation();

  useEffect(() => {
    logger.log(errors);
  }, [errors]);

  const onCreate = async (data) => {
    logger.log('here');

    registration({
      ...data,
      tenderId: tenderId,
    })
      .unwrap()
      .then(() => {
        notify('Success', 'tender created successfully');
      })
      .catch(() => {
        notify('Error', 'Already Registered');
      });
  };

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isRegistering} />
      <TextInput
        label="Password"
        withAsterisk
        error={errors?.password ? errors?.password?.message?.toString() : ''}
        {...register('password')}
      />
      <Button
        variant="filled"
        loading={isRegistering}
        onClick={handleSubmit(onCreate)}
      >
        Register
      </Button>
    </Stack>
  );
}
