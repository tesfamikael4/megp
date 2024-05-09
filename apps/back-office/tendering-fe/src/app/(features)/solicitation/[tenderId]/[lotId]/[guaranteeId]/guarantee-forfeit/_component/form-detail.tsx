'use client';

import type { GuaranteeForfeit } from '@/models/guarantee-forfiet/guarantee-forfiet';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Container,
  Flex,
  LoadingOverlay,
  Textarea,
} from '@mantine/core';
import { Section, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { useReadQuery } from '../../_api/guarantee-request.api';
import {
  useCreateMutation,
  useLazyListByIdQuery,
} from '../_api/guarantee-forfeit.api';

export default function FormDetail() {
  const forfeitSchema: ZodType<Partial<GuaranteeForfeit>> = z.object({
    remark: z.string().optional(),
    reason: z.string().optional(),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(forfeitSchema),
  });

  const { guaranteeId } = useParams();

  const [create, { isLoading }] = useCreateMutation();

  const [trigger, { data: selected, isSuccess: selectedSuccess }] =
    useLazyListByIdQuery();

  const { data: selectedGuarantee } = useReadQuery(guaranteeId?.toString());
  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        guaranteeId: guaranteeId,
        status: 'REQUESTED',
      });

      notify('Success', 'Guarantee Forfeit created successfully');
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };
  useEffect(() => {
    trigger({ id: guaranteeId?.toString(), collectionQuery: undefined });
    if (selectedSuccess && selected !== undefined) {
      reset({
        remark: selected?.items?.map((item) => item.remark),
        reason: selected?.items?.map((item) => item.reason),
      });
    }
  }, [reset, selected, selectedSuccess, trigger, guaranteeId]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />

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
                selectedSuccess && selected.total > 0
                  ? '  Guarantee Forfeit Detail'
                  : ' New Guarantee Forfeit '
              }
              collapsible={false}
            >
              <Flex justify="space-between" gap={10}>
                <Textarea
                  className="mt-5 w-full"
                  label="Remark"
                  {...register('remark')}
                  disabled={selectedSuccess && selected.total > 0}
                  error={
                    errors?.remark ? errors?.remark?.message?.toString() : ''
                  }
                />
                <Textarea
                  className="mt-5 w-full"
                  label="Reason"
                  {...register('reason')}
                  disabled={selectedSuccess && selected.total > 0}
                  error={
                    errors?.reason ? errors?.reason?.message?.toString() : ''
                  }
                />
              </Flex>

              <Flex justify="flex-end" gap={10}>
                <Button
                  onClick={handleSubmit(onCreate)}
                  className="mt-5"
                  disabled={selectedSuccess && selected.total > 0}
                >
                  Forfeit
                </Button>
              </Flex>
            </Section>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
