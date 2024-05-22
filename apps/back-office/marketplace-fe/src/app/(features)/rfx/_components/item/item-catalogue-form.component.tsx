'use client';
import {
  Box,
  Group,
  Stack,
  TextInput,
  NumberInput,
  Flex,
  Checkbox,
  Select,
  MultiSelect,
  Button,
  Paper,
  Divider,
} from '@mantine/core';

import { logger } from '@megp/core-fe';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Data as template } from './sample-data';
import { DocumentFormDetail } from './document/document-form-detail';

export default function CatalogForm({
  data,
  onSearch,
  onSave,
  loading,
  disabled,
}: any) {
  //   const { itemId, id } = useParams();

  //   const [getTemplate, { data: template, isLoading: templateLoading }] =
  //     useLazyGetTemplateQuery();

  const ValidationSchema = (data: any[]) => {
    const loc: { [key: string]: ZodType<any> } = {};

    data?.forEach((item: any) => {
      const nameToValidate = item.displayName?.toLowerCase().replace(' ', '');
      if (item.dataType === 'number') {
        if (item.validation.isRequired) {
          return (loc[nameToValidate] = z
            .number()
            .min(1, { message: 'This field is required' }));
        } else {
          return (loc[nameToValidate] = z.number().optional());
        }
      } else if (
        item.dataType === 'string' ||
        item.validation.type == 'singleSelect'
      ) {
        if (item.validation.isRequired) {
          return (loc[nameToValidate] = z
            .string({
              required_error: 'This field is required',
              invalid_type_error: 'This field is required to be a string',
            })
            .min(item.validation.min, {
              message: `Provide at least ${item.validation.min} characters`,
            }));
        } else if (item.validation.min) {
          return (loc[nameToValidate] = z
            .string()
            .min(item.validation.min, {
              message: `Provide at least ${item.validation.min} characters`,
            })
            .optional());
        } else if (
          item.validation.isRequired == 'undefined' ||
          !item.validation.isRequired
        ) {
          return (loc[nameToValidate] = z.string().optional());
        } else {
          return (loc[nameToValidate] = z.string().optional());
        }
      } else if (item.validation.type === 'multiSelect') {
        return item.validation.isRequired
          ? (loc[nameToValidate] = z.array(z.any()).nullable())
          : (loc[nameToValidate] = z.array(z.any()).nullable().optional());
      } else if (item.dataType === 'boolean') {
        loc[nameToValidate] = z.boolean().default(false);
      }
    });
    return loc;
  };

  const templateSchema = z.object(ValidationSchema(template?.properties));
  const productCatalogSchema = templateSchema.extend({
    quantity: z.number().optional(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(productCatalogSchema),
  });

  const onError = (err) => {
    logger.log(err);
  };

  //   useEffect(() => {
  //     getTemplate(itemId.toString());
  //   }, [itemId]);

  useEffect(() => {
    reset(data);
  }, [data]);

  return (
    <>
      <Stack>
        <Paper withBorder className="p-4">
          {/* <LoadingOverlay visible={templateLoading} /> */}
          <Box>
            <Flex gap={'sm'} align={'flex-start'}>
              <Stack className="w-full">
                {template?.properties?.map((item, index) => {
                  const nameToValidate = item.displayName
                    .toLowerCase()
                    .replace(' ', '');
                  return item.validation.type == 'string' ? (
                    <Controller
                      key={index}
                      name={nameToValidate}
                      control={control}
                      render={({ field: { name, value, onChange } }) => (
                        <TextInput
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
                      render={({ field: { name, value, onChange } }) => (
                        <NumberInput
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
                  ) : item.dataType == 'boolean' ? (
                    <Controller
                      key={index}
                      name={nameToValidate}
                      control={control}
                      render={({ field: { name, value, onChange } }) => (
                        <Checkbox
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
                  <Controller
                    name={'quantity'}
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        label={'Quantity'}
                        value={value}
                        onChange={onChange}
                        // required={item?.validation?.min}
                        error={errors?.quantity?.message?.toString() ?? ''}
                      />
                    )}
                  />
                )}
                <Divider
                  labelPosition="center"
                  label="Additional Attachments"
                />
                <DocumentFormDetail />
                {template?.properties?.length > 0 && (
                  <Group className="ml-auto">
                    <Button
                      onClick={handleSubmit(onSave, onError)}
                      loading={loading}
                      disabled={disabled}
                    >
                      Save Specification & Search
                    </Button>
                  </Group>
                )}
              </Stack>
            </Flex>
          </Box>
        </Paper>
      </Stack>
    </>
  );
}
