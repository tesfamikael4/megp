'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
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
  onCreate,
  onUpdate,
  OnDelete,
  mode,
  catalog,
  onError,
}: {
  template;
  schema;
  catalog?;
  isLoading;
  onCreate;
  onUpdate;
  OnDelete;
  mode;
  onError?;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (catalog) {
      const temp = {};
      catalog?.specificationValues?.map((item) => {
        const nameToValidate = item?.label?.toLowerCase().replace(' ', '');
        const uomFieldName = `${nameToValidate}_uom`;

        temp[nameToValidate] = item?.value;
        temp[uomFieldName] = item?.uom;
        logger.log(item?.uom);
      });

      reset({
        ...temp,
        quantity: catalog?.quantity,
        location: catalog?.deliveryValues?.location,
        deliverDays: catalog?.deliveryValues?.deliverDays,
      });
    }
  }, [catalog, reset]);
  onError = (err) => logger.error(err);

  return (
    <>
      <Box mih={'80vh'} className="w-full">
        <Stack className="w-full">
          <Flex wrap={'wrap'} gap={'xl'} mih={'40vh'}>
            {template?.properties?.map((item, index) => {
              const nameToValidate = item.displayName
                .toLowerCase()
                .replace(' ', '');
              const uomFieldName = `${nameToValidate}_uom`;

              return item.dataType == 'string' ? (
                <Flex gap={'sm'} className={'w-full'}>
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextInput
                        label={item?.displayName}
                        value={value}
                        onChange={onChange}
                        className={`${item.uom.length !== 0 ? 'w-2/4' : 'w-3/4'}`}
                        placeholder={item?.displayName}
                        required={item?.validation?.min}
                        error={
                          errors?.[nameToValidate]?.message?.toString() ?? ''
                        }
                      />
                    )}
                  />
                  {item.uom.length != 0 && (
                    <Controller
                      name={uomFieldName}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label={'Unit of Measurement'}
                          name={uomFieldName}
                          onChange={onChange}
                          value={value}
                          className="w-1/4"
                          error={errors?.uom?.message?.toString() ?? ''}
                          data={item?.uom?.map((uom) => {
                            return {
                              value: uom,
                              label: uom,
                            };
                          })}
                        />
                      )}
                    />
                  )}
                </Flex>
              ) : item.dataType == 'number' ? (
                <Flex gap={'sm'} className="w-full">
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <NumberInput
                        label={item?.displayName}
                        className={`${item.uom.length !== 0 ? 'w-2/4' : 'w-3/4'}`}
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
                  {item.uom.length != 0 && (
                    <Controller
                      name={uomFieldName}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label={'Unit of Measurement'}
                          name={uomFieldName}
                          onChange={onChange}
                          value={value}
                          className="w-1/4"
                          error={errors?.uom?.message?.toString() ?? ''}
                          data={item?.uom?.map((uom) => {
                            return {
                              value: uom,
                              label: uom,
                            };
                          })}
                        />
                      )}
                    />
                  )}
                </Flex>
              ) : item.dataType == 'boolean' ? (
                <Controller
                  key={index}
                  name={nameToValidate}
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <Checkbox
                      className="mt-auto"
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
              ) : item.dataType == 'singleSelect' ? (
                <Flex gap={'sm'} className="w-full">
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        name="name"
                        className={`${item.uom.length !== 0 ? 'w-2/4' : 'w-3/4'}`}
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

                  {item.uom.length != 0 && (
                    <Controller
                      name={uomFieldName}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label={'Unit of Measurement'}
                          name={uomFieldName}
                          onChange={onChange}
                          value={value}
                          className="w-1/4"
                          error={errors?.uom?.message?.toString() ?? ''}
                          data={item?.uom?.map((uom) => {
                            return {
                              value: uom,
                              label: uom,
                            };
                          })}
                        />
                      )}
                    />
                  )}
                </Flex>
              ) : item.dataType == 'multiSelect' ? (
                <Flex gap={'sm'} className="w-full">
                  <Controller
                    key={index}
                    name={nameToValidate}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <MultiSelect
                        name="name"
                        label={item?.displayName}
                        className={`${item.uom.length !== 0 ? 'w-2/4' : 'w-3/4'}`}
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
                  {item.uom.length != 0 && (
                    <Controller
                      name={uomFieldName}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label={'Unit of Measurement'}
                          name={uomFieldName}
                          onChange={onChange}
                          value={value}
                          className="w-1/4"
                          error={errors?.uom?.message?.toString() ?? ''}
                          data={item?.uom?.map((uom) => {
                            return {
                              value: uom,
                              label: uom,
                            };
                          })}
                        />
                      )}
                    />
                  )}
                </Flex>
              ) : null;
            })}
            <Controller
              name={'quantity'}
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <NumberInput
                  className="w-3/4"
                  label={'Quantity'}
                  value={value}
                  onChange={onChange}
                  error={errors?.quantity?.message?.toString() ?? ''}
                />
              )}
            />
          </Flex>
          {template?.properties?.length > 0 && (
            <Group className="ml-auto pe-4">
              {mode == 'new' ? (
                <Button onClick={handleSubmit(onCreate)}>Save</Button>
              ) : (
                <>
                  {' '}
                  <Button onClick={handleSubmit(onUpdate, onError ?? onError)}>
                    Update
                  </Button>
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
