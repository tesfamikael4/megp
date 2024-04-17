'use client';

import {
  useGetAllLotsQuery,
  useLazyGetLotQuery,
} from '@/app/(features)/_api/registration.api';
import { BidSecurity } from '@/models/bidSecurity';
import {
  useLazyReadQuery,
  useSaveRequestMutation,
  useSubmitRequestMutation,
} from '@/store/api/guarantee/guarantee.api';
import {
  useGetOrganazationQuery,
  useLazyGetUintByIdQuery,
} from '@/store/api/organazation/organazation.api';
import { useGetRegisteredBidQuery } from '@/store/api/registered-bid/registered-bid.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
  rem,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { logger } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { IconAt } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { TableForm } from '../_components/table';

export default function BidSecurityPage() {
  const bidSecuritySchema: ZodType<Partial<BidSecurity>> = z.object({
    lotId: z.string().min(1, { message: 'This field is required' }),
    guarantorId: z.string().min(1, { message: 'This field is required' }),
    guarantorName: z.string().min(1, { message: 'This field is required' }),
    guarantorBranchId: z.string().min(1, { message: 'This field is required' }),
    guarantorBranchName: z
      .string()
      .min(1, { message: 'This field is required' }),

    description: z.string().optional(),
    contactPerson: z
      .object({
        email: z.string().optional(),
        fullName: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
      .optional(),

    revisedValidityDate: z
      .number()
      .min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Partial<BidSecurity>>({
    resolver: zodResolver(bidSecuritySchema),
  });

  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();
  const { id } = useParams();
  const { guaranteeId } = useParams();
  const { data: tenderData, isSuccess: tenderSuccess } =
    useGetRegisteredBidQuery(id?.toString());

  const { data: guarantor } = useGetOrganazationQuery('FINANCIAL_INSTITUTION');
  const [trigger, { data }] = useLazyGetUintByIdQuery();
  const guarantorId = watch('guarantorId');
  const lotId = watch('lotId');

  const [submit] = useSubmitRequestMutation();
  const [save] = useSaveRequestMutation();
  const { data: lots, isLoading: lotLoading } = useGetAllLotsQuery(
    id?.toString(),
  );

  const [triggerLot, { data: lot }] = useLazyGetLotQuery();

  const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;

  const [
    getGuarantee,
    { data: selected, isSuccess: selectedSuccess, isLoading },
  ] = useLazyReadQuery();

  useEffect(() => {
    if (id) {
      getGuarantee(id.toString());
    }
  }, [id]);

  useEffect(() => {
    if (guarantorId) {
      const request: CollectionQuery = {
        where: [
          [
            {
              column: 'parentId',
              value: guarantorId,
              operator: '=',
            },
          ],
        ],
      };
      trigger(guarantorId);
    }
  }, [guarantorId]);

  useEffect(() => {
    if (tenderSuccess) {
      reset({
        amount: parseInt(lot?.bdsBidSecurity.bidSecurityAmount),
        currency: lot?.bdsBidSecurity.bidSecurityCurrency,
        name: tenderData?.name,
        title: tenderData?.organizationName,
      });
    }
  }, [reset, tenderSuccess, tenderData]);

  useEffect(() => {
    triggerLot(lotId?.toString());
  }, [lotId]);
  const onSubmit = async (data) => {
    try {
      const result = await submit({
        ...data,
        id: guaranteeId?.toString(),
      }).unwrap();

      router.push(`/tender-workspace/${id}/guarantee/${result.id}`);

      notifications.show({
        message: 'Guarantee request send successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'errors in sending guarantee request.',
        title: 'Error',
      });
    }
  };
  const onSave = async (data) => {
    try {
      await save(data).unwrap();

      notifications.show({
        message: 'Guarantee request save successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'errors in saving guarantee request.',
        title: 'Error',
      });
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading || lotLoading} />
      <Flex w={'100%'}>
        <Box className=" w-full p-6 bg-[#e7f4f7]">
          <Box className=" w-full p-6 min-h-screen bg-white">
            <Flex className="w-full py-2 mb-3  " justify={'space-between'}>
              <Text fw={600}>Tender/Lot Information</Text>
              <Flex gap={10}>
                <Controller
                  name="lotId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      name={name}
                      placeholder="Pick Lot"
                      value={value}
                      withAsterisk
                      searchable
                      error={
                        errors?.lotId ? errors?.lotId?.message?.toString() : ''
                      }
                      onChange={(value, option) => {
                        const selectedLot = lots?.items?.filter(
                          (item) => item?.id == value,
                        )?.[0];
                        setValue('lotId', selectedLot?.id);
                      }}
                      data={
                        lots?.items?.map((type) => ({
                          value: type?.id,
                          label: type?.name,
                        })) || []
                      }
                    />
                  )}
                />

                <Button
                  w={100}
                  h={35}
                  onClick={handleSubmit(onSubmit, (err) => logger.log(err))}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
            <TableForm lotId={lotId} />
            <Text fw={600} className="mb-5">
              Contact Person
            </Text>

            <>
              <Flex gap={30}>
                <Controller
                  name="guarantorId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      w={isMobile ? '100%' : '100%'}
                      name={name}
                      label="Guarantor"
                      value={value}
                      withAsterisk
                      searchable
                      error={
                        errors?.guarantorId
                          ? errors?.guarantorId?.message?.toString()
                          : ''
                      }
                      onChange={(value, option) => {
                        const selectedGuarantor = guarantor?.items?.filter(
                          (item) => item?.id == value,
                        )?.[0];
                        setValue('guarantorId', selectedGuarantor?.id);
                        setValue('guarantorName', selectedGuarantor?.name);
                      }}
                      data={
                        guarantor?.items?.map((guarantor) => ({
                          value: guarantor?.id,
                          label: guarantor?.name,
                        })) || []
                      }
                    />
                  )}
                />
                <Controller
                  name="guarantorBranchId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      w={isMobile ? '100%' : '100%'}
                      name={name}
                      label="Guarantor Branch"
                      value={value}
                      withAsterisk
                      searchable
                      error={
                        errors?.guarantorId
                          ? errors?.guarantorId?.message?.toString()
                          : ''
                      }
                      onChange={(value, option) => {
                        const selectedGuarantor = data?.items?.filter(
                          (item) => item?.id == value,
                        )?.[0];
                        setValue('guarantorBranchId', selectedGuarantor?.id);
                        setValue(
                          'guarantorBranchName',
                          selectedGuarantor?.name,
                        );
                      }}
                      data={
                        data?.items?.map((branch) => ({
                          value: branch?.id,
                          label: branch?.name,
                        })) || []
                      }
                    />
                  )}
                />
              </Flex>
              <Flex gap={30} className="mt-5">
                <TextInput
                  w={isMobile ? '100%' : '100%'}
                  label="Fulll Name"
                  {...register('contactPerson.fullName')}
                />
                <TextInput
                  w={isMobile ? '100%' : '100%'}
                  label="Phone Number"
                  {...register('contactPerson.phoneNumber')}
                />
              </Flex>

              <Flex gap={30} className="mt-5">
                <TextInput
                  w={isMobile ? '100%' : '100%'}
                  rightSectionPointerEvents="none"
                  rightSection={icon}
                  label="Your email"
                  placeholder="Email"
                  {...register('contactPerson.email')}
                />

                <Controller
                  name="revisedValidityDate"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <NumberInput
                      w={isMobile ? '100%' : '100%'}
                      label="Guarantee Validity Date"
                      placeholder="Guarantee Validity Date"
                      name={name}
                      value={value}
                      onChange={(d) => onChange(parseInt(d as string))}
                      error={
                        errors?.revisedValidityDate
                          ? errors?.revisedValidityDate?.message?.toString()
                          : ''
                      }
                    />
                  )}
                />
              </Flex>

              <Textarea
                label="Remark"
                resize="vertical"
                autosize
                minRows={3}
                maxRows={6}
                {...register('description')}
              />
              <Flex justify={'flex-end'} gap={30}>
                <Box></Box>
                <Button
                  w={100}
                  className=" mt-5 "
                  onClick={handleSubmit(onSave, (err) => logger.log(err))}
                >
                  Save
                </Button>
              </Flex>
            </>
          </Box>
        </Box>
      </Flex>
    </>
  );
}
