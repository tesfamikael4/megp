'use client';
import {
  Box,
  Button,
  Container,
  Flex,
  LoadingOverlay,
  NumberInput,
  Text,
  Textarea,
} from '@mantine/core';

import { GuaranteeExtension } from '@/models/guarantee-extension/guarantee-extension';
import { zodResolver } from '@hookform/resolvers/zod';
import { Section, logger, notify } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { useReadQuery as useGuaranteeQuery } from '../../_api/guarantee-request.api';
import {
  useCreateMutation,
  useReadQuery,
} from '../_api/guarantee-extension.api';
interface FormDetailProps {
  mode: 'new' | 'detail';
}
export default function FormDetail({ mode }: FormDetailProps) {
  const extensionSchema: ZodType<Partial<GuaranteeExtension>> = z.object({
    noOfDays: z.number().min(1, { message: 'This field is required' }),
    remark: z.string().optional(),
    reason: z.string().optional(),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,

    control,
  } = useForm({
    resolver: zodResolver(extensionSchema),
  });

  const router = useRouter();
  const { id, tenderId, lotId, guaranteeId } = useParams();
  const [create, { isLoading }] = useCreateMutation();

  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );
  const { data: selectedGuarantee } = useGuaranteeQuery(
    guaranteeId?.toString(),
  );

  const onCreate = async (data) => {
    try {
      const result = await create({
        ...data,
        guaranteeId: guaranteeId,
        status: 'REQUESTED',
      }).unwrap();

      router.push(
        `/solicitation/${tenderId}/${lotId}/${guaranteeId}/guarantee-extension/${result?.id}`,
      );

      notify('Success', 'Guarantee Extension created successfully');
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        noOfDays: selected?.noOfDays,
        remark: selected?.remark,
        reason: selected?.reason,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);
  const onError = (err) => {
    logger.log(err);
  };

  return (
    <>
      <>
        <LoadingOverlay visible={isLoading} />
        <div className="bg-white -mt-4 -mr-4 -ml-4">
          <div className="container mx-auto ">
            <div className="pt-10 pb-10 text-black font-bold text-2xl flex justify-between">
              <Flex
                align="center"
                className="cursor-pointer "
                onClick={() =>
                  router.push(
                    `/solicitation/${tenderId}/${lotId}/${guaranteeId}?tab=extension`,
                  )
                }
              >
                <IconChevronLeft
                  onClick={() =>
                    router.push(
                      `/solicitation/${tenderId}/${lotId}/${guaranteeId}?tab=extension`,
                    )
                  }
                />

                <Text className="text-xl font-bold">
                  {mode == 'detail' && selectedSuccess && selected !== undefined
                    ? selected?.reason
                    : selectedGuarantee?.bidderName}
                </Text>
              </Flex>
            </div>
          </div>
        </div>
        <Box className="container mx-auto my-4">
          <Container fluid>
            <Flex gap={10} mt={10}>
              <Section
                title=" Guarantee Request Detail"
                collapsible={false}
                w={'600px'}
              >
                <Flex
                  direction="column"
                  className="border-t border-l border-r border-gray-400"
                >
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Phone number
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {selectedGuarantee?.contactPerson.phoneNumber}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Full Name
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {selectedGuarantee?.contactPerson.fullName}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Email
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {selectedGuarantee?.contactPerson.email}
                    </Box>
                  </Flex>
                </Flex>
              </Section>

              <Box className="  w-3/4">
                <Section
                  title={
                    mode == 'detail' &&
                    selectedSuccess &&
                    selected !== undefined
                      ? ' Guarantee Extension Detail '
                      : ' New Guarantee Extension '
                  }
                  collapsible={false}
                >
                  <Controller
                    name="noOfDays"
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        w={'50%'}
                        className="mt-5"
                        label="Extension Days"
                        name={name}
                        value={value}
                        max={31}
                        onChange={(d) => onChange(parseInt(d as string))}
                        disabled={
                          mode == 'detail' &&
                          selectedSuccess &&
                          selected !== undefined
                        }
                        error={
                          errors?.noOfDays
                            ? errors?.noOfDays?.message?.toString()
                            : ''
                        }
                      />
                    )}
                  />

                  <Flex justify="space-between" gap={10}>
                    <Textarea
                      className="mt-5 w-full"
                      label="Remark"
                      {...register('remark')}
                      disabled={
                        mode == 'detail' &&
                        selectedSuccess &&
                        selected !== undefined
                      }
                      error={
                        errors?.remark
                          ? errors?.remark?.message?.toString()
                          : ''
                      }
                    />
                    <Textarea
                      className="mt-5 w-full"
                      label="Reason"
                      disabled={
                        mode == 'detail' &&
                        selectedSuccess &&
                        selected !== undefined
                      }
                      {...register('reason')}
                      error={
                        errors?.reason
                          ? errors?.reason?.message?.toString()
                          : ''
                      }
                    />
                  </Flex>

                  <Flex justify="flex-end" gap={10}>
                    <Button
                      onClick={handleSubmit(onCreate, onError)}
                      className="mt-5"
                      disabled={
                        mode == 'detail' &&
                        selectedSuccess &&
                        selected !== undefined
                      }
                    >
                      Extened
                    </Button>
                  </Flex>
                </Section>
              </Box>
            </Flex>
          </Container>
        </Box>
      </>
    </>
  );
}
