'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Stack, TextInput, Textarea } from '@mantine/core';
import { Section, logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import {
  useCreateMutation,
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/po.api';
import { useParams, useRouter } from 'next/navigation';
import { PurchaseOrder } from '@/models/purchase-order';
import { DateInput } from '@mantine/dates';
import { useReadQuery as useReadRfxQuery } from '../../rfx/_api/rfx/rfx.api';

interface FormDetailProps {
  mode: 'detail' | 'new';
  disableFields?: boolean;
}

const poSchema: ZodType<Partial<PurchaseOrder>> = z.object({
  vendorName: z.string().min(1, { message: 'This field is required' }),
  procurementReference: z
    .string()
    .min(1, { message: 'This field is required' }),
  contactPerson: z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    phone: z.string().min(1, { message: 'This field is required' }),
  }),
  description: z.string().optional(),
  expectedDeliveryDate: z.date({
    required_error: 'This field is required',
  }),
});

export const FormDetail = ({
  mode,
  disableFields = false,
}: FormDetailProps) => {
  const router = useRouter();
  const { id, awardId } = useParams();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,

    register,
  } = useForm<PurchaseOrder>({
    resolver: zodResolver(poSchema),
  });

  const [create, { isLoading: isPoSaving }] = useCreateMutation();
  const { data: selectedAward } = useReadRfxQuery(awardId as string);

  const {
    data: poItem,
    isSuccess: isPoSuccess,
    // isLoading: isPoLoading,
  } = useReadQuery(id?.toString());

  const [updatePo, { isLoading: isPoUpdating }] = useUpdateMutation();
  const [removePo, { isLoading: isPoDeleting }] = useDeleteMutation();

  //event handler
  const onCreate = async (data) => {
    try {
      const res = await create({
        referenceNumber: data.referenceNumber,
        awardId: awardId as string,
        procurementReference: selectedAward?.procurementReferenceNumber,
        vendorId: '4cc2f18a-dfb4-47f4-8439-01f548e24063',
        version: '1',
        vendorName: 'fa',
        description: data.description,
        contactPerson: data?.contactPerson,
        expectedDeliveryDate: data?.expectedDeliveryDate,
        status: 'Draft',
      }).unwrap();

      notify('Success', 'Procurement Requisition created Successfully');
      router.push(`/purchase-order/${res?.id}`);
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onDelete = async () => {
    try {
      await removePo(id as string).unwrap();
      notify('Success', 'Deleted Successfully');
      router.push(`/procurement-requisition`);
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onUpdate = async (data) => {
    try {
      await updatePo({ ...data, id: id?.toString() }).unwrap();
      notify('Success', 'Updated Successfully');
    } catch {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    if (isPoSuccess) {
      reset({
        ...poItem,
        expectedDeliveryDate: new Date(poItem?.expectedDeliveryDate),
        contactPerson: {
          name: poItem?.contactPerson?.name,
          phone: poItem?.contactPerson?.phone,
        },
      });
    }
  }, [isPoSuccess]);

  useEffect(() => {
    if (mode == 'new') {
      reset({
        procurementReference: '',
      });
    }
  }, [isPoSuccess]);

  const onError = (err) => {
    logger.log(err);
  };

  return (
    <Section title="Purchase Order" collapsible={false}>
      <Stack pos={'relative'}>
        <Flex gap="md" pos={'relative'}>
          <Flex direction={'column'} gap={'sm'} className="w-1/2">
            <TextInput
              withAsterisk
              // disabled
              required
              {...register('procurementReference')}
              label="Pr Reference Number"
              placeholder="Pr Reference Number"
              error={(errors.procurementReference?.message as string) ?? ''}
            />
            <TextInput
              withAsterisk
              // disabled
              required
              label="Vendor Name"
              placeholder="Vendor Name"
              {...register('vendorName')}
              error={(errors.vendorName?.message as string) ?? ''}
            />

            <TextInput
              // onChange={onChange}
              label="Contact Person Name"
              className="w-full"
              withAsterisk
              required
              placeholder="Contact Person Name"
              {...register('contactPerson.name')}
              error={(errors?.contactPerson?.name?.message as string) ?? ''}
            />

            <TextInput
              // onChange={onChange}
              label="Contact Person Phone Number"
              className="w-full"
              placeholder="Contact Person Phone Number"
              // withAsterisk
              {...register('contactPerson.phone')}
              error={(errors?.contactPerson?.phone?.message as string) ?? ''}
            />
          </Flex>
          <Flex direction={'column'} gap={'sm'} className="w-1/2">
            <Controller
              name="expectedDeliveryDate"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DateInput
                  label="Expected Delivery Date"
                  placeholder="Expected Delivery Date"
                  error={(errors.expectedDeliveryDate?.message as string) ?? ''}
                  value={value}
                  onChange={onChange}
                  minDate={new Date()}
                />
              )}
            />

            <Textarea
              label="Description"
              placeholder="Purchase Order description"
              autosize
              minRows={3}
              maxRows={3}
              {...register('description')}
              error={(errors.description?.message as string) ?? ''}
              disabled={disableFields}
            />
          </Flex>
        </Flex>

        <EntityButton
          mode={mode}
          onCreate={handleSubmit(onCreate, onError)}
          // onReset={onReset}
          onUpdate={handleSubmit(onUpdate)}
          onDelete={handleSubmit(onDelete)}
          disabled={disableFields}
          isUpdating={isPoUpdating}
          isSaving={isPoSaving}
          isDeleting={isPoDeleting}
        />
      </Stack>
    </Section>
  );
};
