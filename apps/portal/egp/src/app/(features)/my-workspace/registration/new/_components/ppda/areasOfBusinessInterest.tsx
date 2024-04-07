import React, { Suspense } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Fieldset, Flex, Group, LoadingOverlay, Select } from '@mantine/core';
import { MultiSelect } from '@mantine/core';
import { PassFormDataProps } from './formShell';
import {
  useGetLineOfBusinessQuery,
  useGetServicePriceRangeQuery,
} from '../../../_api/query';
import { usePrivilege } from '../../_context/privilege-context';
import { servicesList } from '../../../_constants';
import {
  getCategoryProps,
  getFormattedPriceRangeValues,
  getLineOfBusinessMultiSelectData,
} from '../../../_utils';
import MultiCheckBox from '@/app/(features)/my-workspace/_components/multiCheckBox';
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
  const { data: priceRange, isLoading } = useGetServicePriceRangeQuery({
    key: 'new',
  });

  const { lockElements } = usePrivilege();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'areasOfBusinessInterest',
  });
  const fieldState = control.getFieldState(name, control._formState);

  return (
    <Suspense>
      <Flex className="flex-col gap-6 w-full" justify={'flex-start'}>
        <LoadingOverlay
          visible={getLineOfBusinessValues.isLoading || isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {adjustment && (
          <MultiCheckBox
            label="Category"
            id="category"
            data={servicesList}
            {...getCategoryProps(
              fields,
              remove,
              append,
              fieldState,
              lockElements,
            )}
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
              <Group grow>
                <MultiSelect
                  label="Line Of Business"
                  data={getLineOfBusinessMultiSelectData(
                    field.category,
                    getLineOfBusinessValues.data?.items ?? [],
                  )}
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
                          getLineOfBusinessMultiSelectData(
                            field.category,
                            getLineOfBusinessValues.data?.items ?? [],
                          )?.find((item: any) => item.value == v) as {
                            value: string;
                            label: string;
                          }
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
                  data={getFormattedPriceRangeValues(
                    field.category,
                    priceRange ?? [],
                  )}
                  {...register(`${name}.${index}.priceRange`, 'select')}
                />
              </Group>
            </Fieldset>
          );
        })}
      </Flex>
    </Suspense>
  );
};

export default AreasOfBusinessInterest;
