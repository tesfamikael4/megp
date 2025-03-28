import React, { Suspense } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  Fieldset,
  Flex,
  Group,
  Input,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import MultiCheckBox from '../../../../_components/multiCheckBox';
import { PassFormDataProps } from './formShell';

import FileUploader from '@/app/(features)/vendor/_components/uploader';
import { logger } from '@megp/core-fe';
import { useGetPreferentialQuery } from '@/store/api/preferential-treatment/preferential-treatment.api';
import { preferential } from '../../_constants';
import { PreferentialTreatment as PreferentialTreatmentType } from '@/models/vendorRegistration';
import { useGetVendorQuery } from '../../_api/query';

interface Props extends PassFormDataProps {
  name: any;
  adjustment?: boolean;
}
const findServiceIdByType = (data, type) => {
  const service: { id: string; name: string } = data.find((service) =>
    service?.name?.toLowerCase()?.includes(type?.toLowerCase()),
  );
  return service.id;
};
export const PreferentialTreatment: React.FC<Props> = ({
  control,
  name,
  register,
  adjustment,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'preferential',
  });
  const { data, isLoading } = useGetPreferentialQuery({});
  const { data: vendor, isLoading: isVendorLoading } = useGetVendorQuery({});

  const fieldState = control.getFieldState(name, control._formState);

  const getCategoryProps = () => {
    return {
      value: fields.map((item) => item.category),
      onChange: (categories: string[]) => {
        // console.log(fields.)
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
        categories.map((category) => {
          const existingIndex = fields.findIndex(
            (field) => field.category === category,
          );
          if (existingIndex === -1) {
            append({
              category,
              type: category !== 'msme' ? category : '',
              certiNumber: '',
              certificateUrl: '' as any,
              serviceId:
                category !== 'msme' ? findServiceIdByType(data, category) : '',
            });
          }
        });
      },
      error: fieldState?.error?.message,
    };
  };

  if (isLoading || isVendorLoading) <LoadingOverlay />;
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
                  (val: PreferentialTreatmentType) =>
                    val.category === service.value,
                ),
            )}
            {...getCategoryProps()}
          />
        }
        {fields.map((field, index) => (
          <Fieldset
            tt="uppercase"
            fw={500}
            legend={`${field.category}`}
            key={field.id}
          >
            <Flex direction={'column'} gap={'sm'} className="w-full">
              <Flex align={'flex-start'} gap={'sm'}>
                {field.category === 'msme' && (
                  <Select
                    label="Micro, Small, or Medium Enterprise (MSME) Type"
                    placeholder="Select MSME Registration Type"
                    data={['Micro', 'Small', 'Medium']}
                    className="w-1/2"
                    {...register(`preferential.${index}.type`, 'select')}
                    onChange={(value) => {
                      register(`preferential.${index}.type`, 'select').onChange(
                        value,
                      );
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
                )}
                <Input.Wrapper
                  label="Certificate Number "
                  className={field.category === 'msme' ? `w-1/2` : 'w-1/2'}
                  withAsterisk
                  error={
                    register(`preferential.${index}.certificateNumber`).error
                  }
                >
                  <Input
                    placeholder="Certificate Number"
                    {...register(`preferential.${index}.certiNumber`)}
                  />
                </Input.Wrapper>
              </Flex>
              <Controller
                name={`preferential.${index}.certificateUrl`}
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <FileUploader
                    id={`certificateFor${field.category}`}
                    label={`${field.category} Certificate`}
                    placeholder="Choose File"
                    onChange={onChange}
                    onRemove={onChange}
                    error={
                      register(`preferential.${index}.certificateUrl`).error
                    }
                    getImageUrl={null}
                  />
                )}
              />
            </Flex>
          </Fieldset>
        ))}
      </Flex>
    </Suspense>
  );
};

export default PreferentialTreatment;
