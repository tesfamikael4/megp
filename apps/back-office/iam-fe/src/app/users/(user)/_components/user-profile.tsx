import { LoadingOverlay, Select, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile } from '@/models/user-profile';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../_api/extended.api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { notify } from '@megp/core-fe';

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
        userId: id.toString(),
        extendedProfile: data,
      });
      notify('Success', 'User profile updated successfully');
      setMode('detail');
    } catch (err) {
      notify('Error', 'Errors in creating user profile.');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        id: id.toString(),
        userId: id.toString(),
        extendedProfile: data,
      });
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
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    if (selectedSuccess) {
      selected !== null && setMode('detail');
    }
  }, [selected?.gender, selectedSuccess, id, selected]);

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
