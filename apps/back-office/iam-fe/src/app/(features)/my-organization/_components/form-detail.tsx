import {
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useReadQuery } from '@/app/(features)/organizations/_api/organization.api';
import { useListQuery as useListTypeQuery } from '@/app/(features)/organization-type/_api/organization-type.api';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@megp/auth';
export function FormDetail() {
  const { reset, control, register } = useForm();
  const { organizationId } = useAuth();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(organizationId);

  const { data: orgType } = useListTypeQuery({});

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        code: selected?.code,
        shortName: selected?.shortName,
        description: selected?.description,
        typeId: selected?.typeId,
      });
    }
  }, [reset, selected, selectedSuccess]);
  return (
    <Stack pos={'relative'}>
      <LoadingOverlay visible={isLoading} />
      <TextInput label="Name" disabled {...register('name')} />

      <Textarea
        label="Description"
        autosize
        disabled
        minRows={2}
        {...register('description')}
      />
      <Controller
        name="typeId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled
            name="name"
            label="Organization Type"
            value={value}
            onChange={onChange}
            data={
              orgType?.items?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />
    </Stack>
  );
}
