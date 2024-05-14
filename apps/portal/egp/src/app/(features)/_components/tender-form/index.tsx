import { Button, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { logger, notify } from '@megp/core-fe';
import { useRegistrationMutation } from '../../procurement-notice/_api/register.api';

interface FormDetailProps {
  tenderId?: string;
  envelopType: string;
}

export function TenderFormDetail({ tenderId, envelopType }: FormDetailProps) {
  const tenderSchema: ZodType<Partial<{ password: string }>> = z.object({
    password: z
      .string()
      .min(1, { message: 'This field is required.' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[a-zA-Z]/, {
        message: 'Password must have at least one alphabet character',
      })
      .regex(/[0-9]/, { message: 'Password must have at least one number' })
      .optional()
      .refine(
        (val) => {
          if (envelopType === 'single envelop') {
            return val && val.length > 0; // Password is required if envelopType is 'two envelop'
          }
          return true; // Password is optional otherwise
        },
        { message: 'This field is required for "single envelop" envelopType' },
      ),
    financialPassword: z
      .string()
      .min(1, { message: 'This field is required.' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[a-zA-Z]/, {
        message: 'Password must have at least one alphabet character',
      })
      .regex(/[0-9]/, { message: 'Password must have at least one number' })
      .optional()
      .refine(
        (val) => {
          if (envelopType === 'two envelop') {
            return val && val.length > 0; // Password is required if envelopType is 'two envelop'
          }
          return true; // Password is optional otherwise
        },
        { message: 'This field is required for "two envelop" envelopType' },
      ),
    technicalPassword: z
      .string()
      .min(1, { message: 'This field is required.' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[a-zA-Z]/, {
        message: 'Password must have at least one alphabet character',
      })
      .regex(/[0-9]/, { message: 'Password must have at least one number' })
      .optional()
      .refine(
        (val) => {
          if (envelopType === 'two envelop') {
            return val && val.length > 0; // Password is required if envelopType is 'two envelop'
          }
          return true; // Password is optional otherwise
        },
        { message: 'This field is required for "two envelop" envelopType' },
      ),
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
      envelopType: envelopType,
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

      {envelopType === 'single envelop' ? (
        <TextInput
          label="Password"
          withAsterisk
          error={errors?.password ? errors?.password?.message?.toString() : ''}
          {...register('password')}
        />
      ) : (
        <>
          <TextInput
            label="Technical Password"
            withAsterisk
            error={
              errors?.technicalPassword
                ? errors?.technicalPassword?.message?.toString()
                : ''
            }
            {...register('technicalPassword')}
          />
          <TextInput
            label="Financial Password"
            withAsterisk
            error={
              errors?.financialPassword
                ? errors?.financialPassword?.message?.toString()
                : ''
            }
            {...register('financialPassword')}
          />
        </>
      )}
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
