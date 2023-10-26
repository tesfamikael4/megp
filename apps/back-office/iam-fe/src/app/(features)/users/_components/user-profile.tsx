import { LoadingOverlay, Select, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile } from '@/models/user-profile';
import { useUpdateMutation, useReadQuery } from '../_api/user.api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { notifications } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';

type ModeType = 'new' | 'detail';

const defaultValues = {
  position: '',
  gender: null,
  phone: '',
};

export function UserProfileForm() {
  const profileSchema: ZodType<UserProfile> = z.object({
    position: z.string().optional(),
    gender: z.string().min(1, { message: 'This field is required' }),
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

  const [mode, setMode] = useState<ModeType>('new');

  const [create, { isLoading: isSaving }] = useUpdateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    const dataSent = selectedSuccess && {
      ...selected,
      telephone: data.phone,
      gender: data.gender,
      position: data.position,
    };
    try {
      await create(dataSent);

      notifications.show({
        message: 'Organization profile updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'Errors in creating organization Type.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    const dataSent = selectedSuccess && {
      ...selected,
      telephone: data.phone,
      gender: data.gender,
      position: data.position,
    };
    try {
      await update(dataSent);
      notifications.show({
        message: 'Organization profile updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'errors in updating organization Type.',
        title: 'Error',
        color: 'red',
      });
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode === 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        gender: selected?.gender,
        position: selected?.position,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    if (selectedSuccess) {
      selected.gender !== null && setMode('detail');
    }
  }, [selected?.gender, selectedSuccess, id]);

  return (
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
        error={errors?.position ? errors?.position?.message?.toString() : ''}
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
            error={errors?.gender ? errors?.gender?.message?.toString() : ''}
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
  );
}
