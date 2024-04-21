'use client';
import {
  Flex,
  Box,
  Button,
  LoadingOverlay,
  TextInput,
  Group,
  MultiSelect,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Control, RegisterOptions, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGenerateInvoiceForAdditionalServiceMutation,
  useGetApproveVendorInfoQuery,
} from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { AreasOfBusinessInterest } from './areasOfBusinessInterest';
import { ExtendedRegistrationReturnType } from '../../../_components/detail/formShell';
import { useGetLineOfBusinessesQuery } from '@/store/api/administrationApi';
import { getLineOfBusinesseSelectOptions } from '../../../_utils';

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
      userType: z.union([z.literal('Contractor'), z.literal('Consultant')]),
      classification: z.string(),
      activationDate: z.string(),
      expiryDate: z.string(),
    }),
  ])
  .refine((data) => activationExpiryValidator(data), {
    message: 'Activation date must be before or equal to expiry date',
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
});

export interface PassFormDataProps {
  register: (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
    options?: RegisterOptions<z.infer<typeof formDataSchema>, any> | undefined,
  ) => ExtendedRegistrationReturnType;
  control: Control<z.infer<typeof formDataSchema>, any>;
}

export const AreasOfBusinessInterestForm = ({
  initialValues,
  vendorInfo,
}: {
  initialValues: z.infer<typeof formDataSchema>;
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
  } = useForm<z.infer<typeof formDataSchema>>({
    resolver: zodResolver(formDataSchema),
    defaultValues: initialValues,
  });

  const router = useRouter();
  const getLineOfBusinessValues = useGetLineOfBusinessesQuery({});
  const { data, isLoading } = useGetApproveVendorInfoQuery({});

  const [generatePayment, { isLoading: isSaving }] =
    useGenerateInvoiceForAdditionalServiceMutation({});

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
    };
  };

  const onSubmit = async (values) => {
    try {
      await generatePayment(values.areasOfBusinessInterest)
        .unwrap()
        .then((response) => {
          console.log(response);
          // if (response && response.length > 0) {
          // if (response.some((item) => item.canPay)) {
          NotificationService.successNotification('PPDA successfully created');
          router.push('payment');
          // }
          // }
        });
    } catch (error) {
      NotificationService.requestErrorNotification(error.data.message);
    }
  };

  console.log({ data });
  if (data)
    return (
      <Box className="p-2 w-full relative">
        <LoadingOverlay
          visible={getLineOfBusinessValues.isLoading || isSaving || isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex className="flex-col gap-2 w-full">
            <AreasOfBusinessInterest
              name="areasOfBusinessInterest"
              control={control}
              register={extendedRegister}
              // setValue={setValue}
              adjustment={false}
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
                      data.basic.countryOfRegistration === 'Malawi' && (
                        <TextInput
                          label="PPDA Registration Number"
                          placeholder="Enter PPDA Registration Number"
                        />
                      )}
                  </Group>
                  {getValues('areasOfBusinessInterest').some(
                    (value: z.infer<typeof areasOfBusinessInterestSchema>) =>
                      value.category === 'Goods' ||
                      value.category === 'Services',
                  ) &&
                    data.basic.countryOfRegistration === 'Malawi' && (
                      <Group grow>
                        <TextInput
                          label="PPDA Registration Issued Date"
                          placeholder="Enter PPDA Registration Number"
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
                  <Button
                    onClick={() => router.push('detail')}
                    variant="outline"
                  >
                    Back
                  </Button>
                }
                {<Button type="submit">Save & Continue</Button>}
              </Flex>
            )}
        </form>
      </Box>
    );
};
