'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const CatalogDetalForm = ({
  template,
  schema,
  isLoading,
  onCreate,
  onUpdate,
  OnDelete,
  mode,
  catalog,
}: {
  template;
  schema;
  catalog?;
  isLoading;
  onCreate;
  onUpdate;
  OnDelete;
  mode;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (catalog) {
      const temp = {};
      catalog?.specificationValues?.map((item) => {
        const nameToValidate = item?.label?.toLowerCase().replace(' ', '');
        temp[nameToValidate] = item?.value;
      });
      logger.log({ temp });

      reset({
        ...temp,
        quantity: catalog?.quantity,
        location: catalog?.deliveryValues?.location,
        deliverDays: catalog?.deliveryValues?.deliverDays,
      });
    }
  }, [catalog, reset]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Box mih={'80vh'} className="w-full">
        <Stack className="w-full ml-2">
          <Flex wrap={'wrap'} gap={'xl'}>
            {template?.properties?.map((item, index) => {
              const nameToValidate = item.displayName
                .toLowerCase()
                .replace(' ', '');
              return item.validation.type == 'string' ? (
                <Controller
                  key={index}
                  name={nameToValidate}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      className="w-2/5 "
                      label={item?.displayName}
                      value={value}
                      onChange={onChange}
                      placeholder={item?.displayName}
                      required={item?.validation?.min}
                      error={
                        errors?.[nameToValidate]?.message?.toString() ?? ''
                      }
                    />
                  )}
                />
              ) : item.validation.type == 'number' ? (
                <Controller
                  key={index}
                  name={nameToValidate}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <NumberInput
                      label={item?.displayName}
                      className="w-2/5  "
                      value={value}
                      onChange={onChange}
                      placeholder={item?.displayName}
                      required={item?.validation?.min}
                      error={
                        errors?.[nameToValidate]?.message?.toString() ?? ''
                      }
                    />
                  )}
                />
              ) : item.dataType == 'boolean' ? (
                <Controller
                  key={index}
                  name={nameToValidate}
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <Checkbox
                      className="w-2/5 mt-auto"
                      label={item?.displayName}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={item?.displayName}
                      error={
                        errors?.[nameToValidate]?.message?.toString() ?? ''
                      }
                    />
                  )}
                />
              ) : item.validation.type == 'singleSelect' ? (
                <Controller
                  key={index}
                  name={nameToValidate}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      name="name"
                      className="w-2/5 "
                      label={item?.displayName}
                      value={value}
                      data={
                        item?.validation?.enum?.map((i) => {
                          return {
                            value: i,
                            lable: i,
                          };
                        }) || []
                      }
                      onChange={onChange}
                      placeholder={item?.displayName}
                      withAsterisk={item?.validation?.isRequired ?? false}
                      error={
                        errors?.[nameToValidate]?.message?.toString() ?? ''
                      }
                    />
                  )}
                />
              ) : item.validation.type == 'multiSelect' ? (
                <Controller
                  key={index}
                  name={nameToValidate}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <MultiSelect
                      name="name"
                      className="w-2/5 "
                      label={item?.displayName}
                      value={value}
                      data={
                        item?.validation?.enum?.map((i) => {
                          return {
                            value: i,
                            lable: i,
                          };
                        }) || []
                      }
                      onChange={onChange}
                      placeholder={item?.displayName}
                      withAsterisk={item?.validation?.isRequired ?? false}
                      error={
                        errors?.[nameToValidate]?.message?.toString() ?? ''
                      }
                    />
                  )}
                />
              ) : null;
            })}
            {template?.properties?.length > 0 && (
              <>
                <Controller
                  name={'quantity'}
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <NumberInput
                      className="w-2/5 "
                      label={'Quantity'}
                      value={value}
                      onChange={onChange}
                      error={errors?.quantity?.message?.toString() ?? ''}
                    />
                  )}
                />
                <Controller
                  name={'location'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label={'Location'}
                      name="location"
                      onChange={onChange}
                      value={value}
                      className="w-2/5 "
                      error={errors?.location?.message?.toString() ?? ''}
                      data={[
                        { value: 'location1', label: 'Location 1' },
                        { value: 'location2', label: 'Location 2' },
                      ]}
                    />
                  )}
                />

                <Controller
                  name={'deliverDays'}
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <NumberInput
                      label={'Delivery Days'}
                      value={value}
                      className="w-2/5 "
                      onChange={onChange}
                      error={errors?.deliverDays?.message?.toString() ?? ''}
                    />
                  )}
                />
              </>
            )}
          </Flex>
          {template?.properties?.length > 0 && (
            <Group className="ml-auto">
              {mode == 'new' ? (
                <Button onClick={handleSubmit(onCreate)}>Save</Button>
              ) : (
                <>
                  {' '}
                  <Button onClick={handleSubmit(onUpdate)}>Update</Button>
                  <Button color="red" onClick={OnDelete}>
                    Delete
                  </Button>
                </>
              )}
            </Group>
          )}
        </Stack>
      </Box>
    </>
  );
};
