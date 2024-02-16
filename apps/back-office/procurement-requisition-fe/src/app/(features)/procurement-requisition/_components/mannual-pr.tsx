'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { MantineTree, TreeConfig, logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import {
  useCreateMutation,
  useDeleteMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/procurement-requisition.api';

import { useParams, useRouter } from 'next/navigation';
import {
  useGetClassificationsQuery,
  useGetCurrenciesQuery,
  useLazyGetClassificationsQuery,
} from '@/store/api/administration/administration.api';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { ProcurementRequisition } from '@/models/procurement-requsition';

interface FormDetailProps {
  mode: 'detail' | 'new';

  disableFields?: boolean;
}

const prSchema: ZodType<Partial<ProcurementRequisition>> = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),

  currency: z.string({
    required_error: 'Currency is required',
  }),
  totalEstimatedAmount: z.string({
    required_error: 'Estimated Amount is required',
  }),
  remark: z.string().default(''),
  isMultiYear: z.boolean().default(false),
});

export const FormDetail = ({
  mode,
  disableFields = false,
}: FormDetailProps) => {
  const router = useRouter();
  const { budgetYear: budgetPlanId, id } = useParams();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<ProcurementRequisition>({
    resolver: zodResolver(prSchema),
  });
  const [opened, { close, open }] = useDisclosure();
  const [tags, setTags] = useState<any>([]);

  //
  const { data: classifications } = useGetClassificationsQuery({
    where: [
      [
        {
          column: 'parentCode',
          value: 'IsNull',
          operator: 'IsNull',
        },
      ],
    ],
  } as any);

  const { data: currency } = useGetCurrenciesQuery({} as any);
  const [getChildren, { isLoading }] = useLazyGetClassificationsQuery();
  // pr rtk query
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [
    getPr,
    {
      data: procurementRequisition,
      isSuccess: isPrSuccess,
      isLoading: isPrLoading,
    },
  ] = useLazyReadQuery();
  const [updatePr, { isLoading: isPrUpdating }] = useUpdateMutation();
  const [removePr, { isLoading: isPrDeleting }] = useDeleteMutation();

  //configs
  const treeConfig: TreeConfig<any> = {
    id: 'code',
    label: 'title',
    selectable: true,
    multipleSelect: true,
    selectedIds: tags,
    setSelectedIds: setTags,
    load: async (data) => {
      const res = await getChildren({
        where: [
          [
            {
              column: 'parentCode',
              value: data.code,
              operator: '=',
            },
          ],
        ],
      }).unwrap();
      return {
        result:
          res?.items?.map((c) => ({
            code: c.code,
            title: c.title,
          })) ?? [],
        loading: isLoading,
      };
    },
  };

  //event handler
  const onCreate = async (data) => {
    const rawData = {
      ...data,
      classification: tags,
      preBudgetPlanId: budgetPlanId,
    };

    logger.log(rawData);

    try {
      const res = await create(rawData).unwrap();
      notify('Success', 'Activity created Successfully');
      router.push(`/procurement-requisition/${res.id}`);
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onDelete = async () => {
    try {
      await removePr(id as string).unwrap();
      notify('Success', 'Deleted Successfully');
      router.push(`/procurement-requisition`);
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  const onUpdate = async (newData) => {
    const rawData = {
      id,

      ...newData,
      classification: tags,
      // preBudgetPlanId: budgetPlanId,
    };

    try {
      await updatePr(rawData).unwrap();
      notify('Success', 'Activity Updated Successfully');
    } catch (err) {
      logger.log(err);
      notify('Error', 'Something went wrong');
    }
  };

  const onReset = () => {
    reset({
      name: '',
      description: '',
    });
  };

  useEffect(() => {
    if (mode === 'detail') {
      getPr(id as string);
    }
  }, [mode, id, getPr]);

  useEffect(() => {
    if (mode === 'detail' && isPrSuccess) {
      setValue('name', procurementRequisition?.title);
      setValue('currency', procurementRequisition?.currency);
      setValue('description', procurementRequisition?.description);
      setValue('isMultiYear', procurementRequisition?.isMultiYear);
      setValue(
        'requisitionReferenceNumber',
        procurementRequisition?.requisitionReferenceNumber,
      );
      setValue('remark', procurementRequisition?.remark);
      setValue(
        'totalEstimatedAmount',
        procurementRequisition?.totalEstimatedAmount,
      );
      setTags(procurementRequisition?.classification ?? []);
    }
  }, [mode, isPrSuccess, setValue, procurementRequisition]);
  const onError = (error) => {
    logger.log({ error });
  };
  return (
    <Stack>
      <Flex gap="md">
        <Box className="w-1/2">
          {mode == 'detail' && <LoadingOverlay visible={isPrLoading} />}
          {mode == 'detail' && (
            <TextInput
              withAsterisk
              disabled
              label="Reference Number"
              {...register('requisitionReferenceNumber')}
            />
          )}
          {mode == 'new' && (
            <TextInput
              withAsterisk
              disabled
              label="Reference Number"
              {...register('requisitionReferenceNumber')}
            />
          )}
          <TextInput
            label="Name"
            withAsterisk
            {...register('name')}
            error={errors.name?.message}
            disabled={disableFields}
          />
          <Controller
            name="currency"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <Select
                withCheckIcon={false}
                name={name}
                value={value}
                onChange={onChange}
                label="Currency"
                data={currency?.items?.map((c) => c.abbreviation) ?? []}
                className="w-full"
                withAsterisk
                searchable
                placeholder="Select Procurement Type"
                error={errors?.currency?.message}
                disabled={disableFields}
              />
            )}
          />
          <Checkbox
            label="is Multi Year"
            className="w-full mt-4 mb-2"
            {...register('isMultiYear')}
            disabled={disableFields}
          />
          <TextInput
            label="Estimated Amount"
            className="w-full"
            {...register('totalEstimatedAmount')}
            error={errors?.totalEstimatedAmount?.message}
            withAsterisk
            disabled={disableFields}
          />
          <MultiSelect
            label="Tag Classification"
            value={tags.map((t) => t.code)}
            data={tags.map((t) => ({
              label: t.title + ' (' + t.code + ')',
              value: t.code,
            }))}
            className="w-full"
            onChange={(data) => {
              setTags(tags.filter((t) => data.includes(t.code)));
              logger.log({ data });
            }}
            disabled={disableFields}
            leftSection={
              <ActionIcon
                onClick={open}
                variant="subtle"
                disabled={disableFields}
              >
                <IconPlus />
              </ActionIcon>
            }
          />
        </Box>
        <Box className="w-1/2">
          <Textarea
            label="Description"
            withAsterisk
            autosize
            minRows={5}
            maxRows={5}
            {...register('description')}
            error={errors.description?.message}
            disabled={disableFields}
          />
          <Textarea
            label="Remark"
            autosize
            minRows={4}
            maxRows={4}
            {...register('remark')}
            disabled={disableFields}
            className="mt-2"
          />
        </Box>
      </Flex>

      <EntityButton
        mode={mode}
        isSaving={isCreating}
        isUpdating={isPrUpdating}
        isDeleting={isPrDeleting}
        onCreate={handleSubmit(onCreate, onError)}
        onReset={onReset}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        disabled={disableFields}
      />

      <Modal
        opened={opened}
        onClose={close}
        title="Select Classifications"
        size="lg"
      >
        <Box className="overflow-y-auto h-[35rem]">
          <MantineTree
            config={treeConfig}
            data={
              classifications
                ? classifications.items.map((c) => ({
                    code: c.code,
                    title: c.title,
                  }))
                : []
            }
          />
        </Box>
        <Divider h={5} />
        <Group justify="end">
          <Button onClick={close}>Done</Button>
        </Group>
      </Modal>
    </Stack>
  );
};
