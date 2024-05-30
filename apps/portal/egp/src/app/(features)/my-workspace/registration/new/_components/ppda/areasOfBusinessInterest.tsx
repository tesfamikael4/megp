import React, { Suspense } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  Fieldset,
  Flex,
  Grid,
  LoadingOverlay,
  Select,
  TextInput,
} from '@mantine/core';
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
} from '../../../_utils';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import MultiCheckBox from '@/app/(features)/my-workspace/_components/multiCheckBox';
import { UserType } from '@/app/(features)/my-workspace/_constants/user-type';
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

export default AreasOfBusinessInterest;
