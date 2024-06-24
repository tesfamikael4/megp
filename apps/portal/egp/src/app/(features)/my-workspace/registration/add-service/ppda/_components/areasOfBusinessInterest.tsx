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
  Grid,
  Group,
  LoadingOverlay,
  MultiSelect,
  Select,
  TextInput,
} from '@mantine/core';

import { Controller, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { servicesList } from '../../../_constants';
import {
  getAddServiceCategoryProps,
  getFormattedPriceRangeValues,
  getLineOfBusinessMultiSelectData,
} from '../../../_utils';
import { Suspense } from 'react';
import { AreasOfBusinessInterestType } from '@/models/vendorRegistration';
import MultiCheckBox from '@/app/(features)/my-workspace/_components/multiCheckBox';
import dayjs from 'dayjs';
import { IconCalendar } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { UserType } from '@/app/(features)/my-workspace/_constants/user-type';

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
        {
          <MultiCheckBox
            label="Category"
            id="category"
            data={servicesList.filter(
              (service) =>
                !data?.areasOfBusinessInterest.some(
                  (val: AreasOfBusinessInterestType) =>
                    val.category === service.value,
                ),
            )}
            {...getAddServiceCategoryProps(fields, remove, append, fieldState)}
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
              <Grid grow gutter={{ base: 'md' }}>
                <Grid.Col span={6}>
                  <Select
                    label="Price Range"
                    placeholder="Select"
                    data={getFormattedPriceRangeValues(
                      field.category,
                      priceRange ?? [],
                    )}
                    {...register(`${name}.${index}.priceRange`, 'select')}
                  />
                </Grid.Col>
                {field.category === 'Works' && (
                  <>
                    <Grid.Col span={6}>
                      <Select
                        label="Classification"
                        placeholder="Select"
                        data={['Contractor', 'Consultants']}
                        {...register(
                          `${name}.${index}.classification`,
                          'select',
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="User Type"
                        placeholder="Select User Type"
                        data={
                          UserType[
                            register(
                              `${name}.${index}.classification`,
                              'select',
                            ).value
                          ]
                        }
                        {...register(`${name}.${index}.userType`, 'select')}
                        disabled={
                          !register(`${name}.${index}.classification`, 'select')
                            .value ||
                          register(`${name}.${index}.userType`, 'select')
                            .disabled
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Controller
                        name={`areasOfBusinessInterest.${index}.expiryDate`}
                        control={control}
                        render={({ field }) => (
                          <DatePickerInput
                            valueFormat="YYYY/MM/DD"
                            label="Expiry Date"
                            placeholder="Expiry Date"
                            leftSection={
                              <IconCalendar size={'1.2rem'} stroke={1.5} />
                            }
                            maxDate={dayjs(new Date()).toDate()}
                            {...register(
                              `areasOfBusinessInterest.${index}.expiryDate`,
                            )}
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
                                `areasOfBusinessInterest.${index}.expiryDate}`,
                              ).error
                            }
                          />
                        )}
                      />
                    </Grid.Col>
                    {field.category === 'Works' && (
                      <>
                        <Grid.Col span={6}>
                          <TextInput
                            label="NCIC Registration Number"
                            placeholder="Enter NCIC Registration Number"
                            {...register(
                              `${name}.${index}.ncicRegistrationNumber`,
                            )}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Controller
                            name={`areasOfBusinessInterest.${index}.ncicRegistrationDate`}
                            control={control}
                            render={({ field }) => (
                              <DatePickerInput
                                // name={`areasOfBusinessInterest.${index}.expiryDate`}}`}
                                valueFormat="YYYY/MM/DD"
                                label="NCIC Registration Issued Date"
                                placeholder="NCIC Registration Issued Date"
                                leftSection={
                                  <IconCalendar size={'1.2rem'} stroke={1.5} />
                                }
                                {...register(
                                  `areasOfBusinessInterest.${index}.ncicRegistrationDate`,
                                )}
                                value={new Date('2023/02/12')}
                                maxDate={dayjs(new Date()).toDate()}
                                onChange={async (value: any) =>
                                  value &&
                                  field.onChange(
                                    dayjs(value)
                                      .format('YYYY/MM/DD')
                                      .toString()
                                      .replace(/\//g, '-'),
                                  )
                                }
                              />
                            )}
                          />
                        </Grid.Col>
                      </>
                    )}
                  </>
                )}
              </Grid>
            </Fieldset>
          );
        })}
      </Flex>
    </Suspense>
  );
};
