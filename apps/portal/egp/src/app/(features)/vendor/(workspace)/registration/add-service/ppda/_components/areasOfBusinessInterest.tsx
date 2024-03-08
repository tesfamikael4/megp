import MultiCheckBox from '@/app/(features)/vendor/_components/multiCheckBox';
import {
  useAddAdditionalServiceMutation,
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
  useGetVendorInfoQuery,
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

import * as z from 'zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { transformCategoryPriceRange } from '../../../new/_components/ppda/areasOfBusinessInterest';
import { AreasOfBusinessInterestType } from '@/models/vendorRegistration';
import { useRouter } from 'next/navigation';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { zodResolver } from '@hookform/resolvers/zod';

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
  const getPriceRangeValues = useGetPriceRangeQuery({
    type: 'new',
  });
  const [saveAdditionalService, { isLoading: isSaving }] =
    useAddAdditionalServiceMutation({});

  const fieldState = control.getFieldState(
    'areasOfBusinessInterest',
    control._formState,
  );

  const getCategoryProps = () => {
    return {
      value: fields.map((item) => item.category),
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
        categories.map((category) => {
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
    };
  };

  const getLineOfBusinessMultiSelectData = (
    businessArea: string,
  ): { value: string; label: string }[] | string[] | [] => {
    if (businessArea === 'Services') {
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
    } else if (businessArea === 'Goods') {
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
    } else if (businessArea === 'Works') {
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

  if (isLoading) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <MultiCheckBox
        label="Category"
        id="category"
        data={[
          {
            value: 'Goods',
            label: 'Goods',
          },
          {
            value: 'Services',
            label: 'Services',
          },
          {
            value: 'Works',
            label: 'Works',
          },
        ].filter(
          (i) =>
            !data?.areasOfBusinessInterest?.some(
              (val: AreasOfBusinessInterestType) => val.category === i.value,
            ),
        )}
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
              {...register(
                `areasOfBusinessInterest.${index}.lineOfBusiness`,
                'select',
              )}
              value={
                register(
                  `areasOfBusinessInterest.${index}.lineOfBusiness`,
                  'select',
                ).value?.id
              }
              defaultValue={register(
                `areasOfBusinessInterest.${index}.lineOfBusiness`,
                'select',
              ).value?.map((v: any) => v.id)}
              onChange={(value) => {
                register(
                  `areasOfBusinessInterest.${index}.lineOfBusiness`,
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
                      ({ valueFrom: valueFromA }, { valueFrom: valueFromB }) =>
                        Number(valueFromA) - Number(valueFromB),
                    )
                  : [],
                field.category,
              )}
              {...register(`${name}.${index}.priceRange`, 'select')}
            />
          </Group>
        </Fieldset>
      ))}
    </>
  );
};
