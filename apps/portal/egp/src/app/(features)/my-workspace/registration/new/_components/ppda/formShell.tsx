'use client';
import { useEffect } from 'react';
import {
  Flex,
  Box,
  Button,
  LoadingOverlay,
  MultiSelect,
  TextInput,
  Group,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
  Control,
  Controller,
  RegisterOptions,
  UseFormSetValue,
  useForm,
} from 'react-hook-form';
import { string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAddFormMutation,
  useGetLineOfBusinessQuery,
} from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { FormData } from '@/models/vendorRegistration';
import AreasOfBusinessInterest from './areasOfBusinessInterest';
import { usePrivilege } from '../../_context/privilege-context';
import { ExtendedRegistrationReturnType } from '../../../_components/detail/formShell';
import {
  getLineOfBusinessMultiSelectData,
  getLineOfBusinesseSelectOptions,
} from '../../../_utils';
import { useGetLineOfBusinessesQuery } from '@/store/api/administrationApi';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';

export interface PassFormDataProps {
  register: (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
    options?: RegisterOptions<FormData, any> | undefined,
  ) => ExtendedRegistrationReturnType;
  control: Control<FormData, any>;
  setValue?: UseFormSetValue<FormData>;
}
export const lineOfBusinessSchema = z.object({
  id: z
    .string()
    .min(2, { message: 'At least one Line Of Business Interest is required' }),
  name: z.string().min(2, { message: 'Line Of Business Interest is required' }),
});

const activationExpiryValidator = (data) => {
  if (!data.activationDate || !data.expiryDate) {
    return true;
  }
  const { activationDate, expiryDate } = data;
  const activation = new Date(activationDate);
  const expiry = new Date(expiryDate);

  if (isNaN(activation.getTime()) || isNaN(expiry.getTime())) {
    // If either date is invalid, return false
    return false;
  }

  // Ensure activation date is before or equal to expiry date
  return activation <= expiry;
};

export const areasOfBusinessInterestSchema = z
  .discriminatedUnion('category', [
    z.object({
      category: z.enum(['Goods', 'Services']),
      priceRange: z.string().min(1, 'Price range must be selected'),
    }),
    z.object({
      category: z.literal('Works'),
      priceRange: z.string().min(1, 'Price range must be selected'),
      userType: string(),
      classification: z.string(),
      activationDate: z.string(),
      expiryDate: z.string(),
      ncicRegistrationNumber: z.string().optional(),
      ncicRegistrationDate: z.string().optional(),
    }),
  ])
  .refine((data) => activationExpiryValidator(data), {
    message: 'Activation date must be before or equal to expiry date',
    path: ['expiryDate'],
  });

export const formDataSchema = z.object({
  lineOfBusiness: z
    .array(lineOfBusinessSchema)
    .refine((arr) => arr.length > 0, {
      message: 'At least one Line Of Business Interest is required',
    }),
  areasOfBusinessInterest: z
    .array(areasOfBusinessInterestSchema)
    .refine((arr) => arr.length > 0, {
      message: 'At least one Areas Of Business Interest is required',
    }),
  ppdaRegistrationNumber: z.string().optional(),
  ppdaRegistrationDate: z.string().optional(),
});

export const AreasOfBusinessInterestForm = ({
  initialValues,
  vendorInfo,
}: {
  initialValues: FormData;
  vendorInfo: {
    userId: string; //session
    status: string;
    level: string;
  };
}) => {
  const {
    handleSubmit,
    formState,
    register,
    setValue,
    watch,
    getFieldState,
    getValues,
    control,
    trigger,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: initialValues,
  });

  const router = useRouter();
  const [save, saveValues] = useAddFormMutation();
  const getLineOfBusinessValues = useGetLineOfBusinessesQuery({});
  const { checkAccess, lockElements, updateAccess } = usePrivilege();

  useEffect(() => {
    return () => {
      updateAccess(vendorInfo.level);
    };
  }, [updateAccess, vendorInfo.level]);
  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Submitted Successfully!');
      router.push(
        initialValues.basic.countryOfRegistration === 'Malawi'
          ? `preferential`
          : 'payment',
      );
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isSuccess, saveValues.isError, router]);

  const extendedRegister = (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
  ): ExtendedRegistrationReturnType => {
    const fieldRegister = register(name);
    const fieldState = getFieldState(name, formState);
    return {
      ...fieldRegister,
      ...(type === 'select' ? { value: getValues(name) } : {}),
      onBlur: async (event: {
        target: any;
        type?: any;
      }): Promise<boolean | void> => {
        trigger(name);
        return await fieldRegister.onBlur(event);
      },
      onFocus: async (event: {
        target: any;
        type?: any;
      }): Promise<boolean | void> => {
        clearErrors(name);
        return await fieldRegister.onBlur(event);
      },
      onChange:
        type === 'select' || type === 'file'
          ? async (e) => await setValue(name, e)
          : fieldRegister.onChange,
      error: fieldState.error?.message,
      ...lockElements('ppda'),
    };
  };

  const onSubmit = (data: typeof formState.defaultValues) => {
    save({
      data: {
        ...initialValues,
        areasOfBusinessInterest: getValues().areasOfBusinessInterest,
        lineOfBusiness: getValues().lineOfBusiness,
        initial: {
          ...vendorInfo,
          level: 'payment',
        },
      },
    });
  };
  return (
    <Box className="p-2 w-full relative">
      <LoadingOverlay
        visible={getLineOfBusinessValues.isLoading || saveValues.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex className="flex-col gap-2 w-full">
          <AreasOfBusinessInterest
            name="areasOfBusinessInterest"
            control={control}
            register={extendedRegister}
            setValue={setValue}
            adjustment={checkAccess('ppda')}
          />
          {watch('areasOfBusinessInterest') &&
            watch('areasOfBusinessInterest').length > 0 && (
              <>
                <Group grow>
                  <MultiSelect
                    label="Line Of Business"
                    data={getLineOfBusinesseSelectOptions(
                      getLineOfBusinessValues.data?.items ?? [],
                    )}
                    placeholder="Select"
                    {...extendedRegister(`lineOfBusiness`, 'select')}
                    value={
                      extendedRegister(`lineOfBusiness`, 'select').value?.id
                    }
                    defaultValue={extendedRegister(
                      `lineOfBusiness`,
                      'select',
                    ).value?.map((v: any) => v.id)}
                    onChange={(value) => {
                      extendedRegister(`lineOfBusiness`, 'select').onChange(
                        value.map((v) => ({
                          id: v,
                          name: (
                            getLineOfBusinesseSelectOptions(
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
                  {getValues('areasOfBusinessInterest').some(
                    (value: z.infer<typeof areasOfBusinessInterestSchema>) =>
                      value.category === 'Goods' ||
                      value.category === 'Services',
                  ) &&
                    watch('basic.countryOfRegistration') === 'Malawi' && (
                      <TextInput
                        label="PPDA Registration Number"
                        placeholder="Enter PPDA Registration Number"
                        {...extendedRegister(`ppdaRegistrationNumber`)}
                      />
                    )}
                </Group>
                {getValues('areasOfBusinessInterest').some(
                  (value: z.infer<typeof areasOfBusinessInterestSchema>) =>
                    value.category === 'Goods' || value.category === 'Services',
                ) &&
                  watch('basic.countryOfRegistration') === 'Malawi' && (
                    <Group grow>
                      <DatePickerInput
                        valueFormat="YYYY/MM/DD"
                        label="PPDA Registration Issued Date"
                        placeholder="PPDA Registration Issued Date"
                        leftSection={
                          <IconCalendar size={'1.2rem'} stroke={1.5} />
                        }
                        maxDate={dayjs(new Date()).toDate()}
                        onChange={async (value: any) =>
                          value &&
                          (await extendedRegister(
                            `ppdaRegistrationDate`,
                          ).onChange(
                            dayjs(value)
                              .format('YYYY/MM/DD')
                              .toString()
                              .replace(/\//g, '-'),
                          ))
                        }
                      />
                    </Group>
                  )}
              </>
            )}
        </Flex>
        {watch('areasOfBusinessInterest') &&
          watch('areasOfBusinessInterest').length > 0 && (
            <Flex className="mt-10 justify-end gap-2">
              {
                <Button onClick={() => router.push('detail')} variant="outline">
                  Back
                </Button>
              }
              {checkAccess('ppda') ? (
                <Button type="submit">Save & Continue</Button>
              ) : (
                <Button
                  onClick={() =>
                    router.push(
                      initialValues.basic.countryOfRegistration === 'Malawi'
                        ? 'preferential'
                        : 'payment',
                    )
                  }
                >
                  Save & Continue
                </Button>
              )}
            </Flex>
          )}
      </form>
    </Box>
  );
};
