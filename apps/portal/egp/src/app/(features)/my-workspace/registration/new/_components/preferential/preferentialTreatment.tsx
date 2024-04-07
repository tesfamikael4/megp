import React, { Suspense, useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  Fieldset,
  Flex,
  Group,
  Input,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import { PassFormDataProps } from './formShell';
import { usePrivilege } from '../../_context/privilege-context';
import FileUploader from '@/app/(features)/vendor/_components/uploader';
import { useGetPreferentialQuery } from '@/store/api/preferential-treatment/preferential-treatment.api';
import { preferential } from '../../../_constants';
import MultiCheckBox from '@/app/(features)/my-workspace/_components/multiCheckBox';
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
}) => {
  const { lockElements } = usePrivilege();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'preferential',
  });
  const [preferentialCertificates, setPreferentialCertificates] = useState<{
    ibm: string | null;
    msme: string | null;
    marginalized: string | null;
  }>({
    ibm: null,
    msme: null,
    marginalized: null,
  });
  const updatePreferentialCertificates = (key, value) =>
    setPreferentialCertificates((prev) => ({
      ...prev,
      ...(value
        ? {
            [key]: `${VENDOR_URL}/upload/get-file/preferential-documents/${value}`,
          }
        : { [key]: null }),
    }));
  const { data, isLoading } = useGetPreferentialQuery({});
  const fieldState = control.getFieldState(name, control._formState);

  const getCategoryProps = () => {
    return {
      value: fields.map((item) => {
        return item.category;
      }),
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
              certificateUrl: '',
              certiNumber: '',
              serviceId:
                category !== 'msme' ? findServiceIdByType(data, category) : '',
            });
          }
        });
      },
      error: fieldState?.error?.message,

      // onFocus: () => clearValidationError(fieldName),
      // onBlur: () => validateField(fieldName),
      ...lockElements('preferential'),
    };
  };

  useEffect(() => {
    fields.map((item) => {
      updatePreferentialCertificates(
        item?.category?.toLocaleLowerCase(),
        item.certificateUrl,
      );
    });
  }, [fields]);

  if (isLoading) <LoadingOverlay />;
  return (
    <Suspense>
      <Flex className="flex-col gap-6">
        <LoadingOverlay overlayProps={{ radius: 'sm', blur: 2 }} />
        {adjustment && (
          <MultiCheckBox
            label="Preferential Group"
            id="category"
            data={preferential}
            {...getCategoryProps()}
          />
        )}
        {fields.map((field, index) => {
          return (
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
                  render={({ field: { onChange } }) => (
                    <FileUploader
                      id={`preferential.${index}.certificateUrl`}
                      label={`${field.category} Certificate`}
                      placeholder="Choose File"
                      onChange={onChange}
                      error={
                        register(`preferential.${index}.certificateUrl`).error
                      }
                      getImageUrl={
                        preferentialCertificates[
                          field.category?.toLocaleLowerCase()
                        ]
                      }
                      disabled={
                        register(`preferential.${index}.certificateUrl`)
                          .disabled
                      }
                    />
                  )}
                />
              </Flex>
            </Fieldset>
          );
        })}
      </Flex>
    </Suspense>
  );
};

export default PreferentialTreatment;
