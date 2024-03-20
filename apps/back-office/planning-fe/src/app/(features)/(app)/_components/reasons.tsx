'use client';

import { useAddJustificationMutation } from '@/store/api/reason/reason.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Group,
  Select,
  Stack,
  Tabs,
  Textarea,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { IconInfoCircle } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const reasonsSchema: ZodType<any> = z.object({
  reason: z.string().min(1, { message: 'Possible reason is required' }),
  remark: z.string().min(1, { message: 'Remark is required' }),
});

export const Reasons = ({
  justification,
  page,
}: {
  justification: Record<string, any>;
  page: 'pre' | 'post';
}) => {
  const [addJustification, { isLoading }] = useAddJustificationMutation();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<any>({
    resolver: zodResolver(reasonsSchema),
  });

  const onSubmit = async (data, key) => {
    try {
      await addJustification({
        ...data,
        [`${page}BudgetPlanActivityId`]: justification?.[key]?.activityId,
        type: key,
      }).unwrap();
      notify('Success', 'Justification added successfully');
      // close();
    } catch (err) {
      logger.log({ err });
      notify('Error', 'Something went wrong');
    }
  };
  const onError = (err) => {
    logger.log({ err });
  };

  return (
    <div className="w-2/5 border-l-2 p-5">
      <h1 className="text-xl mb-2 text-center font-semibold">Justification</h1>

      <>
        <Tabs defaultValue="procurementMethod">
          <Tabs.List>
            {Object.entries(justification).map(([key, value]: any) => (
              <Tabs.Tab value={key} key={key}>
                {value?.title}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {Object.entries(justification).map(([key, value]: any) => (
            <Tabs.Panel value={key} className="p-2" key={key}>
              <Alert
                variant="light"
                color="red"
                title={
                  <Group gap={5}>
                    <IconInfoCircle />
                    <p>Warning</p>
                  </Group>
                }
                // icon={<IconInfoCircle />}
                className="mb-2"
              >
                {value?.message}
              </Alert>

              <Stack>
                <Controller
                  name="reason"
                  control={control}
                  render={({ field }) => (
                    <Select
                      withCheckIcon={false}
                      {...field}
                      data={value?.possibleReasons ?? ['Other']}
                      label="Possible Reasons"
                      withAsterisk
                      error={errors.reason?.message?.toString()}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="remark"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Remark"
                      withAsterisk
                      error={errors.remark?.message?.toString()}
                    />
                  )}
                />

                {/* <FileInput label="Attachment" /> */}
                <Group justify="end">
                  <Button
                    onClick={() => {
                      handleSubmit((data) => onSubmit(data, key), onError)();
                    }}
                    loading={isLoading}
                  >
                    Submit
                  </Button>
                </Group>
              </Stack>
            </Tabs.Panel>
          ))}
        </Tabs>
      </>
    </div>
  );
};
