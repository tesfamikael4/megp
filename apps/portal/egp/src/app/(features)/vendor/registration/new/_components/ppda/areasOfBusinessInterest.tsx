import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Fieldset, Flex, Group, LoadingOverlay, Select } from '@mantine/core';
import { MultiSelect } from '@mantine/core';
import MultiCheckBox from '../../../../_components/multiCheckBox';
import { PassFormDataProps } from './formShell';

import {
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
} from '../../../_api/query';
import { usePrivilege } from '../../_context/privilege-context';

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
  const { lockElements } = usePrivilege();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'areasOfBusinessInterest',
  });
  const fieldState = control.getFieldState(name, control._formState);

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
    ...lockElements('ppda'),
  });
  const getLineOfBusinessMultiSelectData = (businessArea: string) => {
    if (businessArea === 'services') {
      return [
        'Maintenance of Motor Vehicles',
        'Maintenance of Office Equipment, Refrigeration & Air-Conditioning',
        'Cleaning Services',
        'Plumbing Services',
        'Transport Services',
        'Travel Agency',
        'Consultancy',
        'Provision of Security Services',
        'Servicing of Firefighting Equipment',
      ];
    } else if (businessArea === 'goods') {
      return [
        'Office Equipment',
        'Farm Implements',
        'Plant and Motor Vehicle Spares',
        'Laboratory & Hospital Equipment',
        'Tools and Hardware',
        'Office Consumables',
        'Plumbing Materials',
        'Telecommunications Equipment',
        'Textile Products',
      ];
    } else if (businessArea === 'works') {
      return [
        'Building',
        'Civil',
        'Consultants',
        'Electrical',
        'Specialist',
        'Temporal Consultant',
      ];
    } else {
      return [];
    }
  };
  return (
    <Flex className="flex-col gap-6">
      <LoadingOverlay
        visible={
          getLineOfBusinessValues.isLoading || getPriceRangeValues.isLoading
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
              data={getLineOfBusinessMultiSelectData(field.category)}
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
