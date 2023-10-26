import {
  Box,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useReadQuery } from '../../organizations/_api/organization.api';
import { useListQuery as useListTypeQuery } from '../../organization-type/_api/organization-type.api';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export function FormDetail() {
  const { reset, control, register } = useForm();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery('099454a9-bf8f-45f5-9a4f-6e9034230250');

  const { data: orgType } = useListTypeQuery();

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
    <Stack>
      <Box pos={'relative'}>
        <LoadingOverlay visible={isLoading} />
        <TextInput disabled label="Name" {...register('name')} />
        <TextInput
          disabled
          label="Short name"
          required
          {...register('shortName')}
        />
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
      </Box>
    </Stack>
  );
}
