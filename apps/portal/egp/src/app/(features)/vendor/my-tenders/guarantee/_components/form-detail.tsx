'use client';
import { BidSecurity } from '@/models/bidSecurity';
import {
  useLazyReadQuery,
  useSubmitRequestMutation,
} from '@/store/api/guarantee/guarantee.api';
import {
  useLazyGetUintByIdQuery,
  useOrganizationsQuery,
} from '@/store/api/organazation/organazation.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Flex, Modal, Select, Textarea } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CollectionQuery } from '@megp/entity';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const FormDetail = ({ mode }: FormDetailProps) => {
  const bidSecuritySchema: ZodType<Partial<BidSecurity>> = z.object({
    guarantorId: z.string().min(1, { message: 'This field is required' }),
    guarantorBranchId: z.string().min(1, { message: 'This field is required' }),
    amount: z.number().min(1, { message: 'This field is required' }),
    remark: z.string().optional(),
  });

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
    watch,
  } = useForm<Partial<BidSecurity>>({
    resolver: zodResolver(bidSecuritySchema),
    defaultValues: {
      amount: 10,
    },
  });

  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

  const { data: guarantor } = useOrganizationsQuery({});
  const [trigger, { data }] = useLazyGetUintByIdQuery();
  const guarantorId = watch('guarantorId');
  const { id } = useParams();
  const [create, { isLoading: isSaving }] = useSubmitRequestMutation();
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

  const onCreate = async (data) => {
    close();
    try {
      const result = await create(data).unwrap();

      router.push(`/vendor/my-tenders/guarantee/${result.id}`);

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

  return (
    <>
      <Flex gap={30} className="mt-5">
        <Controller
          name="guarantorId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <Select
              w={570}
              name={name}
              label="Guarantor"
              value={value}
              withAsterisk
              error={
                errors?.guarantorId
                  ? errors?.guarantorId?.message?.toString()
                  : ''
              }
              onChange={onChange}
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
              w={570}
              name={name}
              label="Guarantor Branch"
              value={value}
              withAsterisk
              error={
                errors?.guarantorId
                  ? errors?.guarantorId?.message?.toString()
                  : ''
              }
              onChange={onChange}
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
      <Flex justify={'flex-end'} gap={30}>
        <Box></Box>
        <Button w={100} className=" mt-5 " onClick={open}>
          Save
        </Button>
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title="Add Guarantee Remark "
      >
        <Textarea
          label="Remark"
          resize="vertical"
          autosize
          minRows={2}
          maxRows={6}
          {...register('remark')}
        />
        <Flex justify="flex-end" gap={10}>
          <Button variant="outline" className="mt-5" onClick={close}>
            Cancel
          </Button>

          <Button onClick={handleSubmit(onCreate)} className="mt-5">
            Done
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default FormDetail;
