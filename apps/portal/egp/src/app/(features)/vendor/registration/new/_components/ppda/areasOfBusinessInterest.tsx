import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Fieldset, Flex, Group, LoadingOverlay, Select } from '@mantine/core';
import { MultiSelect } from '@mantine/core';
import MultiCheckBox from '../../../../_components/multiCheckBox';
import { PassFormDataProps } from './formShell';

import {
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
  useLazyGetFPPADataQuery,
  useLazyGetNCICDataQuery,
} from '../../_api/query';

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
  const getLineOfBusinessValues = useGetLineOfBusinessQuery({});
  const getPriceRangeValues = useGetPriceRangeQuery({
    type: 'new',
  });
  const [getFPPAData, getFPPADataValues] = useLazyGetFPPADataQuery({});
  const [getNCICData, getNCICDataValues] = useLazyGetNCICDataQuery({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'areasOfBusinessInterest',
  });
  const fieldState = control.getFieldState(name, control._formState);

  useEffect(() => {
    return () => {
      const categorys = fields.map((item) => item.category);

      if (categorys.includes('goods')) {
        getFPPAData({ tin: '1111111111' });
      }
      if (categorys.includes('services')) {
        getFPPAData({ tin: '1111111111' });
      }

      if (categorys.includes('works')) {
        getNCICData({ tin: '1111111111' });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (categorys.includes('goods')) {
        getFPPAData({ tin: '1111111111' });
      }
      if (categorys.includes('services')) {
        getFPPAData({ tin: '1111111111' });
      }

      if (categorys.includes('works')) {
        getNCICData({ tin: '1111111111' });
      }
      categorys.map((category) => {
        const existingIndex = fields.findIndex(
          (field) => field.category === category,
        );
        if (existingIndex === -1) {
          append({
            category,
            lineOfBusiness: [], // Start with an empty array
            priceRange: '',
          });
        }
      });
    },
    error: fieldState?.error?.message,
    // onFocus: () => clearValidationError(fieldName),
    // onBlur: () => validateField(fieldName),
  });
  const getLineOfBusinessMultiSelectData = (businessArea: string) => {
    if (businessArea === 'goods' || businessArea === 'services') {
      return [
        {
          value: getFPPADataValues.data ? getFPPADataValues.data.id : '',
          label: getFPPADataValues.data
            ? getFPPADataValues.data.businessType
            : '',
        },
      ];
    } else if (businessArea === 'works') {
      return [
        {
          value: getNCICDataValues.data ? getNCICDataValues.data.id : '',
          label: getNCICDataValues.data
            ? getNCICDataValues.data.serviceType
            : '',
        },
      ];
    } else {
      return [];
    }
  };
  return (
    <Flex className="flex-col gap-6">
      <LoadingOverlay
        visible={
          getLineOfBusinessValues.isLoading ||
          getPriceRangeValues.isLoading ||
          getNCICDataValues.isLoading ||
          getFPPADataValues.isLoading
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
        <Fieldset
          tt="uppercase"
          fw={500}
          legend={`${field.category}`}
          key={field.id}
        >
          <Group grow>
            <MultiSelect
              label="Line Of Business"
              data={
                getLineOfBusinessValues.isSuccess
                  ? getLineOfBusinessMultiSelectData(field.category)
                  : []
              }
              placeholder="Select"
              {...register(`${name}.${index}.lineOfBusiness`, 'select')}
              value={
                register(`${name}.${index}.lineOfBusiness`, 'select').value?.id
              }
              defaultValue={register(
                `${name}.${index}.lineOfBusiness`,
                'select',
              ).value?.map((v: any) => v.id)}
              onChange={(value) => {
                console.log(value);
                register(`${name}.${index}.lineOfBusiness`, 'select').onChange(
                  value.map((v) => ({
                    id: v,
                    name: getLineOfBusinessMultiSelectData(field.category),
                  })),
                );
              }}
            />
            <Select
              label="Price Range"
              placeholder="Select"
              data={transformCategoryPriceRange(
                getPriceRangeValues.isSuccess &&
                  getPriceRangeValues.data &&
                  getPriceRangeValues.data.length
                  ? getPriceRangeValues.data
                  : [],
                field.category,
              )}
              {...register(`${name}.${index}.priceRange`, 'select')}
            />
          </Group>
        </Fieldset>
      ))}
    </Flex>
  );
};

export default AreasOfBusinessInterest;
