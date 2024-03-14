import MultiCheckBox from '@/app/(features)/vendor/_components/multiCheckBox';
import {
  useAddAdditionalServiceMutation,
  useGetLineOfBusinessQuery,
  useGetServicePriceRangeQuery,
  useGetVendorQuery,
} from '../../../_api/query';
import {
  Button,
  Fieldset,
  Flex,
  Group,
  LoadingOverlay,
  MultiSelect,
  Select,
} from '@mantine/core';

import { useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { servicesList } from '../../../_constants';
import {
  getAddServiceCategoryProps,
  getFormattedPriceRangeValues,
  getLineOfBusinessMultiSelectData,
} from '../../../_utils';
import { Suspense } from 'react';

export const AreasOfBusinessInterest = ({
  name,
  control,
  register,
  adjustment,
}: {
  name: string;
  control: any;
  register: any;
  adjustment: boolean;
}) => {
  const { data, isLoading } = useGetVendorQuery({});
  const router = useRouter();

  const { fields, append, remove }: any = useFieldArray({
    control,
    name: 'areasOfBusinessInterest',
  });

  const getLineOfBusinessValues = useGetLineOfBusinessQuery({});
  const { data: priceRange, isLoading: isPriceRangeLoading } =
    useGetServicePriceRangeQuery({
      key: 'new',
    });
  const [saveAdditionalService, { isLoading: isSaving }] =
    useAddAdditionalServiceMutation({});

  const fieldState = control.getFieldState(
    'areasOfBusinessInterest',
    control._formState,
  );

  if (isLoading) {
    return <LoadingOverlay />;
  }
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
            {...getAddServiceCategoryProps(fields, remove, append, fieldState)}
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
