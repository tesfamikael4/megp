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
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const reasonsSchema: ZodType<any> = z.object({
  reason: z.string().min(1, { message: 'Possible reason is required' }),
  remark: z.string().min(1, { message: 'Remark is required' }),
});

export const Reasons = ({ justification }: { justification: any }) => {
  const [currentKey, setCurrentKey] = useState('');
  const [addJustification, { isLoading }] = useAddJustificationMutation();

  const {
    handleSubmit,
    formState: { errors },
    control,
    // setValue,
  } = useForm<any>({
    resolver: zodResolver(reasonsSchema),
  });

  const onSubmit = async (data) => {
    try {
      await addJustification({
        ...data,
        objectId: justification[currentKey].objectId,
        preBudgetPlanActivityId: justification[currentKey].activityId,
        type: currentKey,
      }).unwrap();
      notify('Success', 'Justification added successfully');
      close();
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
            {Object.entries(justification).map(([key]: any) => (
              <Tabs.Tab value={key} key={key}>
                {justification[key].title}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {Object.entries(justification).map(([key, value]: any) => (
            <Tabs.Panel value={key} className="p-2" key={key}>
              <Alert
                variant="light"
                color="red"
                title="Warning"
                icon={<IconInfoCircle />}
                className="mb-2"
              >
                {justification[key].message}
              </Alert>

              <Stack>
                <Controller
                  name="reason"
                  control={control}
                  render={({ field }) => (
                    <Select
                      withCheckIcon={false}
                      {...field}
                      data={justification[key]?.possibleReasons ?? ['Other']}
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
                      setCurrentKey(key);
                      handleSubmit(onSubmit, onError)();
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
