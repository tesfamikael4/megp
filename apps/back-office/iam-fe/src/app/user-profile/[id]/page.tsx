'use client';

import {
  Divider,
  Flex,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile } from '@/models/user-profile';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/extended.api';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { notify } from '@megp/core-fe';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../auth.module.scss';
import ppda from '../../../../public/ppda.png';
import { IconChevronLeft } from '@tabler/icons-react';

type ModeType = 'new' | 'detail';

const defaultValues = {
  position: '',
  gender: null,
  phone: '',
};

export default function UserProfileForm() {
  const profileSchema: ZodType<UserProfile> = z.object({
    position: z.string().optional(),
    gender: z.string().min(1, { message: 'This field is required' }),
    address: z.string().min(1, { message: 'This field is required' }),
    email: z
      .string()
      .email({ message: 'Must be a valid email' })
      .optional()
      .nullable()
      .or(z.literal('')),
    phone: z
      .string()
      .refine(
        (value) => {
          if (value === '') {
            return true;
          }

          return /^\d{9,12}$/.test(value);
        },
        {
          message: 'Please enter a valid telephone number',
        },
      )
      .optional(),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const { id } = useParams();
  const route = useRouter();

  const [mode, setMode] = useState<ModeType>('new');

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    try {
      await create({
        accountId: id?.toString(),
        extendedProfile: data,
      }).unwrap();
      setMode('detail');
      notify('Success', 'User profile updated successfully');
    } catch (err) {
      notify('Error', 'Errors in creating user profile.');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        id: id.toString(),
        accountId: id?.toString(),
        extendedProfile: data,
      }).unwrap();
      notify('Success', 'User profile updated successfully');
    } catch {
      notify('Error', 'Errors in updating user profile.');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode === 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        gender: selected?.extendedProfile.gender,
        position: selected?.extendedProfile.position,
        phone: selected?.extendedProfile.phone,
        email: selected?.extendedProfile.email,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    if (selectedSuccess) {
      selected !== null && setMode('detail');
    }
  }, [selected?.gender, selectedSuccess, selected]);

  return (
    <div className="flex flex-row justify-center align-center items-center mt-4 min-w-max">
      <Paper
        radius="md"
        p="sm"
        withBorder
        mih={'70vh'}
        w={500}
        className="flex  flex-col  align-middle"
      >
        <Flex align="center" onClick={() => route.push('/')}>
          <IconChevronLeft />
          Back
        </Flex>
        <Image
          alt="Malawi Republic"
          className={styles.logo}
          height={100}
          src={ppda.src}
          width={100}
        />
        <Divider my="lg" />
        <Stack pos={'relative'}>
          <LoadingOverlay visible={isLoading} />
          <TextInput
            label=" Office Telephone Number "
            {...register('phone')}
            error={errors?.phone ? errors?.phone?.message?.toString() : ''}
          />
          <TextInput
            label="Position"
            {...register('position')}
            error={
              errors?.position ? errors?.position?.message?.toString() : ''
            }
          />
          <TextInput
            label="Address"
            {...register('address')}
            error={errors?.address ? errors?.address?.message?.toString() : ''}
          />
          <TextInput
            label="Email"
            {...register('email')}
            error={errors?.email ? errors?.email?.message?.toString() : ''}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                name="name"
                label="Gender"
                value={value}
                withAsterisk
                error={
                  errors?.gender ? errors?.gender?.message?.toString() : ''
                }
                onChange={onChange}
                data={[
                  {
                    value: 'female',
                    label: 'Female',
                  },
                  {
                    value: 'male',
                    label: 'Male',
                  },
                ]}
              />
            )}
          />
          <EntityButton
            mode={mode}
            onCreate={handleSubmit(onCreate)}
            onUpdate={handleSubmit(onUpdate)}
            onReset={onReset}
            isSaving={isSaving}
            isUpdating={isUpdating}
          />
        </Stack>
      </Paper>
    </div>
  );
}
