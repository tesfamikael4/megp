import {
  useAddActivityMutation,
  useLazyGetWorkflowsQuery,
} from '@/store/api/workflow/workflow.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextInput,
  Button,
  Stack,
  Select,
  LoadingOverlay,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  title: z.string(),
  description: z.string(),
  workflowId: z.string(),
});

type formSchema = z.infer<typeof schema>;

export default function FormDetail({ mode }: { mode: 'update' | 'new' }) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<formSchema>({
    resolver: zodResolver(schema),
  });
  const [addActivity, { isLoading: isSaving }] = useAddActivityMutation();
  const [getWorkflows, { data: workflows, isLoading: isGettingWorkflows }] =
    useLazyGetWorkflowsQuery();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await addActivity(data).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Activity created',
        color: 'green',
      });
      router.push(`/workflow`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    getWorkflows({});
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <LoadingOverlay visible={isGettingWorkflows} />
        <TextInput
          label="Title"
          {...register('title')}
          error={errors?.title?.message}
        />
        <TextInput
          label="Description"
          {...register('description')}
          error={errors?.description?.message}
        />
        <Controller
          name="workflowId"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              name={name}
              label="Application"
              placeholder="Select Application"
              data={workflows?.items?.map((workflow) => ({
                label: workflow?.name,
                value: workflow?.id,
              }))}
              value={value}
              onChange={onChange}
              error={errors?.workflowId?.message}
              withAsterisk
            />
          )}
        />
        <Button type="submit" className="ml-auto" loading={isSaving}>
          Save
        </Button>
      </Stack>
    </form>
  );
}
