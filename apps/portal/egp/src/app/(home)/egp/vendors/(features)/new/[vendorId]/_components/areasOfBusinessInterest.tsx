import React from 'react';
import { useForm, useFieldArray, Control } from 'react-hook-form';
import {
  Box,
  Checkbox,
  Code,
  Fieldset,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  Text,
} from '@mantine/core';
import { MultiSelect } from '@mantine/core';
import MultiCheckBox from '../../../../_components/multiCheckBox';
import { ExtendedRegistrationReturnType, PassFormDataProps } from './formShell';
import { FormData } from '@/models/vendorRegistration';
import {
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
} from '@/store/api/vendor_registration/query';

export const transformLineOfBusinessData = (
  inputData: any,
  businessArea: string,
) =>
  inputData
    .filter(
      (item: any) =>
        item.businessArea.toLowerCase() === businessArea.toLowerCase(),
    )
    .map((item: any) => ({
      value: item.id,
      label: item.description,
    }));
export const transformCategoryPriceRange = (
  inputData: any,
  businessArea: string,
) =>
  inputData
    .filter(
      (item: any) =>
        item.businessArea.toLowerCase() === businessArea.toLowerCase(),
    )
    .map((item: any) => ({
      value: item.id,
      label: `${item.valueFrom} to ${item.valueTo} ${item.currency}`,
    }));
const getLabelByValue = (
  data: {
    value: string;
    label: string;
  }[],
  targetValue: string,
): string | null => {
  for (const item of data) {
    if (item.value === targetValue) {
      return item.label;
    }
  }
  return null;
};
interface Props extends PassFormDataProps {
  name: any;
}
export const AreasOfBusinessInterest: React.FC<Props> = ({
  control,
  name,
  register,
}) => {
  const getLineOfBusinessRequestInfo = useGetLineOfBusinessQuery({});
  const getPriceRangeRequestInfo = useGetPriceRangeQuery({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'areasOfBusinessInterest',
  });
  const fieldState = control.getFieldState(name, control._formState);

  console.log(fieldState);
  const getCategoryProps = () => ({
    value: fields.map((item) => item.category),
    onChange: (categorys: string[]) => {
      const fieldsCategorys = fields.map((item) => item.category);
      const difference = fieldsCategorys.filter(
        (category) => !categorys.includes(category),
      );
      difference.map((category) => {
        const notExistingIndex = fields.findIndex(
          (field) => field.category === category,
        );
        remove(notExistingIndex);
      });

      categorys.map((category) => {
        const existingIndex = fields.findIndex(
          (field) => field.category === category,
        );
        console.log('existingIndex', existingIndex);
        if (existingIndex === -1) {
          append({
            category,
            lineOfBusiness: [], // Start with an empty array
            priceId: '',
          });
        }
      });
    },
    error: fieldState?.error?.message,
    // onFocus: () => clearValidationError(fieldName),
    // onBlur: () => validateField(fieldName),
  });
  return (
    <Flex className="flex-col gap-6">
      <LoadingOverlay
        visible={
          getLineOfBusinessRequestInfo.isLoading ||
          getPriceRangeRequestInfo.isLoading
        }
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <MultiCheckBox
        label="Category"
        id="category"
        data={[
          {
            value: 'goods',
            label: 'Goods',
          },
          {
            value: 'services',
            label: 'Services',
          },
          {
            value: 'works',
            label: 'Works',
          },
        ]}
        {...getCategoryProps()}
      />

      {fields.map((field, index) => (
        <Fieldset legend={`${field.category}`} key={field.id}>
          <MultiSelect
            label="Line Of Business"
            data={transformLineOfBusinessData(
              getLineOfBusinessRequestInfo.isSuccess &&
                getLineOfBusinessRequestInfo.data &&
                getLineOfBusinessRequestInfo.data.items.length
                ? getLineOfBusinessRequestInfo.data.items
                : [],
              field.category,
            )}
            placeholder="Select"
            {...register(`${name}.${index}.lineOfBusiness`, 'select')}
            value={
              register(`${name}.${index}.lineOfBusiness`, 'select').value?.id
            }
            onChange={(value) => {
              register(`${name}.${index}.lineOfBusiness`, 'select').onChange(
                value.map((v) => ({
                  id: v,
                  name: getLabelByValue(
                    transformLineOfBusinessData(
                      getLineOfBusinessRequestInfo.isSuccess &&
                        getLineOfBusinessRequestInfo.data &&
                        getLineOfBusinessRequestInfo.data.items.length
                        ? getLineOfBusinessRequestInfo.data.items
                        : [],
                      field.category,
                    ),
                    v as string,
                  ),
                })),
              );
            }}
          />
          <Select
            label="Price Range"
            placeholder="Select"
            data={transformCategoryPriceRange(
              getPriceRangeRequestInfo.isSuccess &&
                getPriceRangeRequestInfo.data &&
                getPriceRangeRequestInfo.data.items.length
                ? getPriceRangeRequestInfo.data.items
                : [],
              field.category,
            )}
            {...register(`${name}.${index}.priceId`, 'select')}
          />
        </Fieldset>
      ))}
    </Flex>
  );
};

export default AreasOfBusinessInterest;
