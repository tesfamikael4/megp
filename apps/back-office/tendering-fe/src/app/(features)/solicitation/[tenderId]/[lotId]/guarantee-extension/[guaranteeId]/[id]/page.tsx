'use client';
import { DetailTable } from '@/app/(features)/_components/detail-table';
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

import { Section, logger, notify } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { GuaranteeExtension } from '@/models/guarantee-extension/guarantee-extension';
import { ZodType, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateMutation,
  useReadQuery as useReadExtensionQuery,
} from '../../_api/guarantee-extension.api';
import { useEffect } from 'react';
import { useReadQuery } from '../../../_api/guarantee-request.api';

export default function ExtensionDetail() {
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
  } = useForm({
    resolver: zodResolver(extensionSchema),
  });

  const router = useRouter();
  const { id, tenderId, lotId, guaranteeId } = useParams();
  const [create, { isLoading }] = useCreateMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadExtensionQuery(
    id?.toString(),
  );
  const { data: selectedGuarantee } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        guaranteeId: guaranteeId,
        status: 'REQUESTED',
      }).unwrap();
      notify('Success', 'Guarantee Extension created successfully');
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };
  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        reason: selected?.reason,
        remark: selected?.remark,
      });
    }
  }, [reset, selected, selectedSuccess]);

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
                    `/solicitation/${tenderId}/${lotId}?tab=extension`,
                  )
                }
              >
                <IconChevronLeft />

                <Text className="text-xl font-bold">
                  {selectedGuarantee?.bidderName}
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
                <Section title=" New Guarantee Extension " collapsible={false}>
                  <NumberInput
                    w={'50%'}
                    className="mt-5 "
                    label="Extension Days"
                  />
                  <Flex justify="space-between" gap={10}>
                    <Textarea
                      className="mt-5 w-full"
                      label="Remark"
                      {...register('remark')}
                      error={
                        errors?.remark
                          ? errors?.remark?.message?.toString()
                          : ''
                      }
                    />
                    <Textarea
                      className="mt-5 w-full"
                      label="Reason"
                      {...register('reason')}
                      error={
                        errors?.reason
                          ? errors?.reason?.message?.toString()
                          : ''
                      }
                    />
                  </Flex>

                  <Flex justify="flex-end" gap={10}>
                    <Button onClick={handleSubmit(onCreate)} className="mt-5">
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
