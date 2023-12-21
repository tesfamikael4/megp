'use client';

import { BudgetPlanActivities } from '@/models/budget-plan-activities';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { Tree, logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { notifications } from '@mantine/notifications';
import {
  useCreateMutation,
  useDeleteMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/activities.api';
import {
  useCreateMutation as useCreatePostActivityMutation,
  useDeleteMutation as useDeletePostActivityMutation,
  useLazyReadQuery as useLazyReadPostActivityQuery,
  useUpdateMutation as useUpdatePostActivityMutation,
} from '../_api/post-activity.api';
import { useParams, useRouter } from 'next/navigation';
import { useGetClassificationsQuery } from '@/store/api/administration/administration.api';
import { useDisclosure } from '@mantine/hooks';

interface FormDetailProps {
  mode: 'detail' | 'new';
  page: 'pre' | 'post';
  disableFields?: boolean;
}

const activitiesSchema: ZodType<Partial<BudgetPlanActivities>> = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),

  currency: z.string({
    required_error: 'Currency is required',
  }),
  estimatedAmount: z.number({
    required_error: 'Estimated Amount is required',
  }),
  remark: z.string().default(''),
  isMultiYear: z.boolean().default(false),
});

export const FormDetail = ({
  mode,
  page,
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
    watch,
  } = useForm<BudgetPlanActivities>({
    resolver: zodResolver(activitiesSchema),
  });
  const [opened, { open, close }] = useDisclosure();
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

  // pre rtk query
  const [createPre, { isLoading: isPreCreating }] = useCreateMutation();
  const [getPreActivity, { data: preActivity, isSuccess: isPreSuccess }] =
    useLazyReadQuery();
  const [updatePre, { isLoading: isPreUpdating }] = useUpdateMutation();
  const [removePre, { isLoading: isPreDeleting }] = useDeleteMutation();
  // post rtk query
  const [createPost, { isLoading: isPostCreating }] =
    useCreatePostActivityMutation();
  const [getPostActivity, { data: postActivity, isSuccess: isPostSuccess }] =
    useLazyReadPostActivityQuery();
  const [updatePost, { isLoading: isPostUpdating }] =
    useUpdatePostActivityMutation();
  const [removePost, { isLoading: isPostDeleting }] =
    useDeletePostActivityMutation();

  const method = watch('procurementMethod');

  //event handler
  const onCreate = async (data) => {
    const rawData =
      page == 'pre'
        ? {
            ...data,
            // multiYearBudget: [],
            // donor: {},
            classification: tags,
            preBudgetPlanId: budgetPlanId,
          }
        : {
            ...data,
            // multiYearBudget: [],
            // donor: {},
            classification: tags,
            postBudgetPlanId: budgetPlanId,
          };
    logger.log(rawData);

    try {
      if (page == 'pre') {
        const res = await createPre(rawData).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Activity created success-fully',
          color: 'green',
        });
        router.push(`/pre-budget-plan/${budgetPlanId}/activities/${res.id}`);
      } else {
        const res = await createPost(rawData).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Activity created success-fully',
          color: 'green',
        });
        router.push(`/post-budget-plan/${budgetPlanId}/activities/${res.id}`);
      }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      if (page == 'pre') {
        await removePre(id as string).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Deleted Success-fully',
          color: 'green',
        });
        router.push(`/pre-budget-plan/${budgetPlanId}/activities/`);
      } else {
        await removePost(id as string).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Deleted Success-fully',
          color: 'green',
        });
        router.push(`/post-budget-plan/${budgetPlanId}/activities/`);
      }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  const onUpdate = async (newData) => {
    const rawData =
      page === 'pre'
        ? {
            id,
            ...preActivity,
            ...newData,
            classification: tags,
            preBudgetPlanId: budgetPlanId,
          }
        : {
            id,
            ...postActivity,
            ...newData,
            classification: tags,
            postBudgetPlanId: budgetPlanId,
          };
    try {
      if (page == 'pre') {
        await updatePre(rawData);
        notifications.show({
          title: 'Success',
          message: 'Activity Updated Success-fully',
          color: 'green',
        });
      } else {
        await updatePost(rawData);
        notifications.show({
          title: 'Success',
          message: 'Activity Updated Success-fully',
          color: 'green',
        });
      }
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
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
      page === 'pre' && getPreActivity(id as string);
      page === 'post' && getPostActivity(id as string);
    }
  }, [mode, id, getPreActivity, page, getPostActivity]);

  useEffect(() => {
    if (mode === 'detail' && (isPreSuccess || isPostSuccess)) {
      if (page == 'pre') {
        setValue('name', preActivity?.name);
        setValue('currency', preActivity?.currency);
        setValue('description', preActivity?.description);
        setValue('isMultiYear', preActivity?.isMultiYear);
        setValue('procurementReference', preActivity?.procurementReference);
        setValue('remark', preActivity?.remark);
        setValue('estimatedAmount', preActivity?.estimatedAmount);
        setTags(preActivity?.classification ?? []);
      }
      if (page == 'post') {
        setValue('name', postActivity?.name);
        setValue('currency', postActivity?.currency);
        setValue('description', postActivity?.description);
        setValue('isMultiYear', postActivity?.isMultiYear);
        setValue('procurementReference', postActivity?.procurementReference);
        setValue('remark', postActivity?.remark);
        setValue('estimatedAmount', postActivity?.estimatedAmount);
        setTags(preActivity?.classification ?? []);
      }
    }
  }, [
    mode,
    isPreSuccess,
    postActivity,
    setValue,
    isPostSuccess,
    page,
    preActivity,
  ]);

  return (
    <Stack>
      <TextInput
        label="Name"
        withAsterisk
        {...register('name')}
        error={errors.name?.message}
        disabled={disableFields}
      />

      <Textarea
        label="Description"
        withAsterisk
        autosize
        minRows={2}
        maxRows={10}
        {...register('description')}
        error={errors.description?.message}
        disabled={disableFields}
      />

      <Flex gap="md">
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
              data={['MWK', 'USD', 'EUR', 'KPW']}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Type"
              error={errors?.currency?.message}
              disabled={disableFields}
            />
          )}
        />
        <Controller
          name="estimatedAmount"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Estimated Amount"
              name={name}
              value={value}
              onChange={(d) => onChange(parseInt(d as string))}
              className="w-full"
              error={errors?.estimatedAmount?.message}
              withAsterisk
              disabled={method === 'Purchased Orders' || disableFields}
            />
          )}
        />
      </Flex>

      <Checkbox
        label="is Multi Year"
        className="w-full"
        {...register('isMultiYear')}
        disabled={disableFields}
      />
      <Flex gap="md" align="end">
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
        />
        <Button onClick={open} disabled={disableFields}>
          Select
        </Button>
      </Flex>

      <Textarea
        label="Remark"
        autosize
        minRows={2}
        maxRows={10}
        {...register('remark')}
        disabled={disableFields}
      />

      <EntityButton
        mode={mode}
        isSaving={isPreCreating || isPostCreating}
        isUpdating={isPreUpdating || isPostUpdating}
        isDeleting={isPreDeleting || isPostDeleting}
        onCreate={handleSubmit(onCreate)}
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
        <Tree
          fieldNames={{ title: 'title', key: 'code' }}
          data={classifications ? classifications.items : []}
          mode="select"
          disableModal
          selectedKeys={tags}
          multiSelect
          url={(code) =>
            `${
              process.env.NEXT_PUBLIC_ADMINISTRATION_API ??
              '/administration/api/'
            }classifications?q=w%3DparentCode%3A%3D%3A${code}`
          }
          onDone={(data) => {
            logger.log({ data });
            const castedData = (data as any[]).map((d) => ({
              title: d.title,
              code: d.code,
            }));
            setTags(castedData);
            close();
          }}
        />
      </Modal>
    </Stack>
  );
};
