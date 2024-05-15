import {
  LoadingOverlay,
  Stack,
  TextInput,
  Box,
  Modal,
  Flex,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Contract } from '@/models/contract';
import {
  useCreateMutation,
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/contract.api';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import SelectOrganization from './select-organization';
import { Section, notify } from '@megp/core-fe';

interface FormDetailProps {
  mode: 'new' | 'detail';
  disableFields?: boolean;
}

const defaultValues = {
  contractReferenceNumber: '',
  description: '',
  contractTitle: '',
  startDate: '',
  endDate: '',
};

export function FormDetail({ mode, disableFields }: FormDetailProps) {
  const contractSchema: ZodType<Partial<Contract>> = z.object({
    contractReferenceNumber: z.string().min(1, { message: 'Name is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    contractTitle: z.string().min(1, { message: 'abbreviation is required' }),
    startDate: z.date().min(new Date(), { message: 'Start Date is required' }),
    endDate: z.date().min(new Date(), { message: 'End Date is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,

    register,
  } = useForm({
    resolver: zodResolver(contractSchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [opened, { open, close }] = useDisclosure();
  const [selectedOrg, setSelectedOrg] = useState<any[]>([]);

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const onCreate = async (data) => {
    try {
      const result = await create({
        ...data,
        vendor: {
          id: selectedOrg[0]?.id,
          name: selectedOrg[0]?.name,
          shortName: selectedOrg[0]?.shortName,
          code: selectedOrg[0]?.code,
        },
      }).unwrap();

      router.push(`/contract-catalogs/${result?.id}`);
      notify('Success', 'Contract catalog Created successfully');
    } catch (error) {
      const errorMessage =
        error.data?.message || error.message || 'Something went wrong';
      notify('Error', errorMessage);
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
        vendor: {
          id: selectedOrg[0]?.id,
          name: selectedOrg[0]?.name,
          shortName: selectedOrg[0]?.shortName,
          code: selectedOrg[0]?.code,
        },
      });
      notify('Success', 'Contract catalog Updated successfully');
    } catch {
      notify('Error', 'Error in Updating Contract Catalog.');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notify('Success', 'Contract Catalog Deleted successfully');

      router.push('/contract-catalogs');
    } catch (err) {
      notify('Error', 'Error in Deleting Contract Catalog');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };
  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        contractReferenceNumber: selected?.contractReferenceNumber,
        contractTitle: selected?.contractTitle,
        description: selected?.description,
        startDate: new Date(selected?.startDate),
        endDate: new Date(selected?.endDate),
      });
      setSelectedOrg([selected?.vendor]);
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Section title="Contract Catalog Identification" collapsible={false}>
      <LoadingOverlay visible={isLoading} />
      <Flex className="w-full" gap={'sm'}>
        <Box className="w-1/2">
          <Stack pos="relative">
            <TextInput
              withAsterisk
              label="Reference No"
              {...register('contractReferenceNumber')}
              error={
                errors?.contractReferenceNumber
                  ? errors?.contractReferenceNumber?.message?.toString()
                  : ''
              }
              required
            />
            <TextInput
              withAsterisk
              label="Contract Title"
              {...register('contractTitle')}
              error={
                errors?.contractTitle
                  ? errors?.contractTitle?.message?.toString()
                  : ''
              }
              required
            />
            <TextInput
              withAsterisk
              label="Description"
              {...register('description')}
              error={
                errors?.description
                  ? errors?.description?.message?.toString()
                  : ''
              }
              required
            />{' '}
          </Stack>
        </Box>
        <Box className="w-1/2">
          <Stack>
            <TextInput
              label="Vendor"
              onClick={open}
              value={selectedOrg?.[0]?.name}
            />
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="Start Date"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  error={
                    errors?.startDate
                      ? errors?.startDate?.message?.toString()
                      : ''
                  }
                  required
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="End Date"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  error={
                    errors?.endDate ? errors?.endDate?.message?.toString() : ''
                  }
                  required
                />
              )}
            />
          </Stack>
        </Box>
      </Flex>
      <EntityButton
        mode={mode}
        // data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
      <Modal
        title={<Box fw={'bold'}>Select Vendor</Box>}
        onClose={close}
        opened={opened}
        size={'xl'}
      >
        <SelectOrganization
          selectedOrg={selectedOrg}
          opened={opened}
          close={close}
          setSelectedOrg={setSelectedOrg}
        />
      </Modal>
    </Section>
  );
}
