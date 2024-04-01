'use client';

import { BudgetPlanActivities } from '@/models/budget-plan-activities';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import {
  MantineTree,
  Section,
  TreeConfig,
  logger,
  notify,
} from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
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
import {
  useGetClassificationsQuery,
  useGetCurrenciesQuery,
  useLazyGetClassificationsQuery,
} from '@/store/api/administration/administration.api';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';

interface FormDetailProps {
  mode: 'detail' | 'new';
  page: 'pre' | 'post';
  disableFields?: boolean;
}

const activitiesSchema: ZodType<Partial<BudgetPlanActivities>> = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),

  currency: z
    .string({
      required_error: 'Currency is required',
    })
    .default('MKW'),
  estimatedAmount: z.string().min(1, {
    message: 'Estimated Amount is required',
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
    register,
    watch,
  } = useForm<BudgetPlanActivities>({
    resolver: zodResolver(activitiesSchema),
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

  //configs
  const treeConfig: TreeConfig<any> = {
    id: 'code',
    label: 'title',
    selectable: true,
    multipleSelect: true,
    selectedIds: tags,
    setSelectedIds: (data: any[]) => {
      let temp: any[] = [];
      data.map((item: any) => {
        if (!temp.includes(item)) {
          temp.push(item);
        } else {
          const filteredTags = temp.filter((tag) => tag.code !== item.code);
          temp = filteredTags;
        }
      });
      setTags(temp);
    },
    load: async (data) => {
      // logger.log({ data });
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
    if (parseInt(data.estimatedAmount) >= 0) {
      const rawData =
        page == 'pre'
          ? {
              ...data,
              classification: tags,
              preBudgetPlanId: budgetPlanId,
            }
          : {
              ...data,
              classification: tags,
              postBudgetPlanId: budgetPlanId,
            };
      logger.log(rawData);

      try {
        if (page == 'pre') {
          const res = await createPre(rawData).unwrap();
          notify('Success', 'Activity created Successfully');
          router.push(`/pre-budget-plan/${budgetPlanId}/activities/${res.id}`);
        } else {
          const res = await createPost(rawData).unwrap();
          notify('Success', 'Activity created Successfully');
          router.push(`/post-budget-plan/${budgetPlanId}/activities/${res.id}`);
        }
      } catch (err) {
        notify('Error', 'Something went wrong');
      }
    } else {
      notify('Error', 'Estimated Amount should be greater than 0');
    }
  };
  const onDelete = async () => {
    try {
      if (page == 'pre') {
        await removePre(id as string).unwrap();
        notify('Success', 'Deleted Successfully');
        router.push(`/pre-budget-plan/${budgetPlanId}/activities/`);
      } else {
        await removePost(id as string).unwrap();
        notify('Success', 'Deleted Successfully');
        router.push(`/post-budget-plan/${budgetPlanId}/activities/`);
      }
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  const onUpdate = async (newData) => {
    if (parseInt(newData.estimatedAmount) >= 0) {
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
          await updatePre(rawData).unwrap();
          notify('Success', 'Activity Updated Successfully');
        } else {
          await updatePost(rawData).unwrap();
          notify('Success', 'Activity Updated Successfully');
        }
      } catch (err) {
        logger.log(err);
        notify('Error', 'Something went wrong');
      }
    } else {
      notify('Error', 'Estimated Amount should be greater than 0');
    }
  };

  const onReset = () => {
    setTags([]);
    reset({
      name: '',
      // currency: undefined,
      description: '',
      isMultiYear: false,
      remark: '',
      estimatedAmount: undefined,
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
        reset({
          name: preActivity?.name,
          currency: preActivity?.currency,
          description: preActivity?.description,
          isMultiYear: preActivity?.isMultiYear,
          procurementReference: preActivity?.procurementReference,
          remark: preActivity?.remark,
          estimatedAmount: preActivity?.estimatedAmount,
        });
        setTags(preActivity?.classification ?? []);
      }
      if (page == 'post') {
        reset({
          name: postActivity?.name,
          currency: postActivity?.currency,
          description: postActivity?.description,
          isMultiYear: postActivity?.isMultiYear,
          procurementReference: postActivity?.procurementReference,
          remark: postActivity?.remark,
          estimatedAmount: postActivity?.estimatedAmount,
        });
        setTags(postActivity?.classification ?? []);
      }
    }
  }, [
    mode,
    isPreSuccess,
    postActivity,
    isPostSuccess,
    page,
    preActivity,
    reset,
  ]);

  return (
    <Section title="Activity Identification" collapsible={false}>
      <Stack>
        <Flex gap="md">
          <Box className="w-1/2">
            <TextInput
              label="Name"
              withAsterisk
              {...register('name')}
              error={errors.name?.message}
              disabled={disableFields}
              placeholder="Activity Name"
            />
            <Controller
              name="currency"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <Select
                  withCheckIcon={false}
                  name={name}
                  // value={value ?? null}
                  value="MKW"
                  onChange={onChange}
                  label="Currency"
                  data={currency?.items?.map((c) => c.abbreviation) ?? []}
                  className="w-full"
                  withAsterisk
                  searchable
                  placeholder="Select Currency"
                  error={errors?.currency?.message}
                  // disabled={disableFields}
                  disabled
                />
              )}
            />
            <Checkbox
              label="is Multi Year"
              className="w-full mt-4 mb-2"
              {...register('isMultiYear')}
              disabled={disableFields}
            />
            <Controller
              name="estimatedAmount"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <TextInput
                  label="Estimated Amount"
                  className="w-full"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  error={errors?.estimatedAmount?.message}
                  withAsterisk
                  disabled={method === 'Purchased Orders' || disableFields}
                  placeholder="Estimated Amount"
                  type="number"
                />
              )}
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
              placeholder="Tag Classification"
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
              placeholder="Activity Description"
            />
            <Textarea
              label="Remark"
              autosize
              minRows={4}
              maxRows={4}
              {...register('remark')}
              disabled={disableFields}
              className="mt-2"
              placeholder="Activity Remark"
            />
          </Box>
        </Flex>

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
    </Section>
  );
};
