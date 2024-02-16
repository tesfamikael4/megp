import React, { Suspense, useEffect } from 'react';
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
import { useSearchParams } from 'next/navigation';

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
  adjustment?: boolean;
}
export const AreasOfBusinessInterest: React.FC<Props> = ({
  control,
  name,
  register,
  adjustment,
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

  const getCategoryProps = () => {
    return {
      value: fields.map((item) => item.category),
      onChange: (categorys: string[]) => {
        // console.log(fields.)
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
    };
  };
  const getLineOfBusinessMultiSelectData = (
    businessArea: string,
  ): { value: string; label: string }[] | string[] | [] => {
    if (businessArea === 'services') {
      return (
        ([...(getLineOfBusinessValues.data?.items || [])]

          .map((item) => {
            if (item.businessArea === 'Services') {
              return {
                value: item.id,
                label: item.description,
              };
            } else {
              return undefined;
            }
          })
          .filter(Boolean) as { value: string; label: string }[]) || []
      );
    } else if (businessArea === 'goods') {
      return (
        ((getLineOfBusinessValues.data?.items || [])
          .map((item) => {
            if (item.businessArea === 'Goods') {
              return {
                value: item.id,
                label: item.description,
              };
            } else {
              return undefined;
            }
          })
          .filter(Boolean) as { value: string; label: string }[]) || []
      );
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
      // Handle unexpected values of businessArea
      console.error(`Unsupported businessArea: ${businessArea}`);
      return [];
    }
  };

  return (
    <Suspense>
      <Flex className="flex-col gap-6">
        <LoadingOverlay
          visible={
            getLineOfBusinessValues.isLoading || getPriceRangeValues.isLoading
          }
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {adjustment && (
          <MultiCheckBox
            label="Category"
            id="category"
            data={[
              {
                value: 'goods',
                label: 'Goods',
                disabled: localStorage.getItem('category')
                  ? localStorage.getItem('category') !== 'goods'
                  : false,
              },
              {
                value: 'services',
                label: 'Services',
                disabled: localStorage.getItem('category')
                  ? localStorage.getItem('category') !== 'services'
                  : false,
              },
              {
                value: 'works',
                label: 'Works',
                disabled: localStorage.getItem('category')
                  ? localStorage.getItem('category') !== 'works'
                  : false,
              },
            ]}
            {...getCategoryProps()}
          />
        )}
        {(localStorage.getItem('category')
          ? fields.filter(
              (field) => field.category === localStorage.getItem('category'),
            )
          : fields
        ).map((field, index) => (
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
                  register(`${name}.${index}.lineOfBusiness`, 'select').value
                    ?.id
                }
                defaultValue={register(
                  `${name}.${index}.lineOfBusiness`,
                  'select',
                ).value?.map((v: any) => v.id)}
                onChange={(value) => {
                  register(
                    `${name}.${index}.lineOfBusiness`,
                    'select',
                  ).onChange(
                    value.map((v) => ({
                      id: v,
                      name: (
                        getLineOfBusinessMultiSelectData(field.category)?.find(
                          (item: any) => item.value == v,
                        ) as { value: string; label: string }
                      )?.label,
                    })),
                  );
                }}
                withAsterisk
                required
              />
              <Select
                label="Price Range"
                placeholder="Select"
                data={transformCategoryPriceRange(
                  getPriceRangeValues.isSuccess &&
                    getPriceRangeValues.data &&
                    getPriceRangeValues.data.length
                    ? ([...getPriceRangeValues.data] ?? []).sort(
                        (
                          { valueFrom: valueFromA },
                          { valueFrom: valueFromB },
                        ) => Number(valueFromA) - Number(valueFromB),
                      )
                    : [],
                  field.category,
                )}
                {...register(`${name}.${index}.priceRange`, 'select')}
              />
            </Group>
          </Fieldset>
        ))}
      </Flex>
    </Suspense>
  );
};

export default AreasOfBusinessInterest;
