/**
 * 
const { data, isLoading } = useGetPreferentialQuery({});
const { data: vendor, isLoading: isVendorLoading } = useGetVendorQuery({});
 * data={preferential.filter(
              (service) =>
                !vendor?.preferential.some(
                  (val: PreferentialTreatmentType) =>
                    val.category === service.value,
                ),
            )}
 */

import React, { Suspense, useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  Fieldset,
  Flex,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import { PassFormDataProps, preferentialSchema } from './formShell';
import { useGetPreferentialQuery } from '@/store/api/preferential-treatment/preferential-treatment.api';

import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import MultiCheckBox from '@/app/(features)/my-workspace/_components/multiCheckBox';
import { preferential } from '../../_constants';
import { useGetVendorQuery } from '../../_api/query';
import * as z from 'zod';
import FileUploader from '../../../_components/uploader';
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

interface Props extends PassFormDataProps {
  name: any;
  adjustment?: boolean;
}
const findServiceIdByType = (data, type) => {
  const service: { id: string; name: string } = data?.find((service) =>
    service?.name?.toLowerCase()?.includes(type?.toLowerCase()),
  );
  return service.id;
};
export const PreferentialTreatment: React.FC<Props> = ({
  control,
  name,
  register,
  adjustment,
  setValue,
}) => {
  const { data, isLoading } = useGetPreferentialQuery({});
  const { data: vendor, isLoading: isVendorLoading } = useGetVendorQuery({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'preferential',
  });

  const fieldState = control.getFieldState(name, control._formState);

  const getCategoryProps = () => {
    return {
      value: fields.map((item) => {
        return item.category;
      }),
      onChange: (categories: string[]) => {
        const fieldsCategories = fields.map((item) => item.category);
        const difference = fieldsCategories.filter(
          (category) => !categories.includes(category),
        );
        difference.map((category) => {
          const notExistingIndex = fields.findIndex(
            (field) => field.category === category,
          );
          remove(notExistingIndex);
        });
        categories.map((category: any) => {
          const existingIndex = fields.findIndex(
            (field) => field.category === category,
          );
          if (existingIndex === -1) {
            append({
              category,
              type: category !== 'msme' ? category : '',
              certiNumber: '',
              certificateUrl: '' as any,
              certificateIssuedDate: '',
              certificateValidityPeriod: '',
              serviceId:
                category !== 'msme' ? findServiceIdByType(data, category) : '',
            });
          }
        });
      },
      error: fieldState?.error?.message,
    };
  };

  if (isLoading) <LoadingOverlay />;
  return (
    <Suspense>
      <Flex className="flex-col gap-6">
        <LoadingOverlay overlayProps={{ radius: 'sm', blur: 2 }} />
        {
          <MultiCheckBox
            label="Preferential Group"
            id="category"
            data={preferential.filter(
              (service) =>
                !vendor?.preferential.some(
                  (val: z.infer<typeof preferentialSchema>) =>
                    val.category === service.value,
                ),
            )}
            {...getCategoryProps()}
          />
        }
        {fields.map((field, index) => {
          return (
            <Fieldset
              tt="uppercase"
              fw={500}
              legend={`${field.category}`}
              key={field.id}
            >
              <Flex direction={'column'} gap={'sm'} className="w-full">
                <Grid grow gutter={{ base: 'md' }}>
                  {field.category === 'msme' && (
                    <Grid.Col span={5}>
                      <Select
                        label="Micro, Small, or Medium Enterprise (MSME) Type"
                        placeholder="Select MSME Registration Type"
                        data={['Micro', 'Small', 'Medium']}
                        {...register(`preferential.${index}.type`, 'select')}
                        onChange={(value) => {
                          register(
                            `preferential.${index}.type`,
                            'select',
                          ).onChange(value);
                          register(
                            `preferential.${index}.serviceId`,
                            'select',
                          ).onChange(findServiceIdByType(data, value));
                        }}
                        error={
                          register(`preferential.${index}.type`, 'select').error
                        }
                        withAsterisk
                      />
                    </Grid.Col>
                  )}
                  <Grid.Col span={5}>
                    <Input.Wrapper
                      label="Certificate Number"
                      withAsterisk
                      error={
                        register(`preferential.${index}.certiNumber`).error
                      }
                    >
                      <Input
                        placeholder="Certificate Number"
                        {...register(`preferential.${index}.certiNumber`)}
                      />
                    </Input.Wrapper>
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Controller
                      name={`preferential.${index}.certificateValidityPeriod`}
                      control={control}
                      render={({ field }) => (
                        <DatePickerInput
                          valueFormat="YYYY/MM/DD"
                          required
                          label="Certificate Validity Period"
                          placeholder="Certificate Validity Period"
                          leftSection={
                            <IconCalendar size={'1.2rem'} stroke={1.5} />
                          }
                          maxDate={dayjs(new Date()).toDate()}
                          // {...register(`${name}.${index}.activationDate`)}
                          onChange={async (value: any) =>
                            value &&
                            field.onChange(
                              dayjs(value)
                                .format('YYYY/MM/DD')
                                .toString()
                                .replace(/\//g, '-'),
                            )
                          }
                          error={
                            register(
                              `preferential.${index}.certificateValidityPeriod`,
                            ).error
                          }
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Controller
                      name={`preferential.${index}.certificateIssuedDate`}
                      control={control}
                      render={({ field }) => (
                        <DatePickerInput
                          valueFormat="YYYY/MM/DD"
                          required
                          label="Certificate Issued Date"
                          placeholder="Certificate Issued Date"
                          leftSection={
                            <IconCalendar size={'1.2rem'} stroke={1.5} />
                          }
                          maxDate={dayjs(new Date()).toDate()}
                          // {...register(`${name}.${index}.activationDate`)}
                          onChange={async (value: any) =>
                            value &&
                            field.onChange(
                              dayjs(value)
                                .format('YYYY/MM/DD')
                                .toString()
                                .replace(/\//g, '-'),
                            )
                          }
                          error={
                            register(
                              `preferential.${index}.certificateIssuedDate`,
                            ).error
                          }
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col>
                    <Controller
                      name={`preferential.${index}.certificateUrl`}
                      control={control}
                      render={({ field: _field }) => (
                        <FileUploader
                          id={`preferential.${index}.certificateUrl`}
                          label={`${field.category} Certificate`}
                          placeholder="Choose File"
                          error={
                            register(`preferential.${index}.certificateUrl`)
                              .error
                          }
                          onChange={(file: File) => {
                            _field.onChange(file);
                          }}
                          // getImageUrl={invoiceSlipImageUrl}
                        />
                      )}
                    />
                  </Grid.Col>
                </Grid>
              </Flex>
            </Fieldset>
          );
        })}
      </Flex>
    </Suspense>
  );
};

export default PreferentialTreatment;
