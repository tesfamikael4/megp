import { useAddJustificationMutation } from '@/store/api/reason/reason.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FileInput,
  Group,
  Modal,
  Select,
  Stack,
  Textarea,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const reasonsSchema: ZodType<any> = z.object({
  reason: z.string().min(1, { message: 'Possible reason is required' }),
  remark: z.string().min(1, { message: 'Remark is required' }),
});

export const Reasons = ({
  opened,
  close,
  validationResult,
  objectId,
  activityId,
  type,
}: {
  opened: boolean;
  close: () => void;
  validationResult?: any;
  objectId: string;
  activityId: string;
  type: string;
}) => {
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
      await addJustification({ ...data, objectId, activityId, type }).unwrap();
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
    <Modal opened={opened} onClose={close} size={'lg'} title="Justification">
      {/* <Text>Tessgjhsdfsh</Text> */}
      <Stack>
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Select
              withCheckIcon={false}
              {...field}
              data={validationResult?.possibleReasons ?? ['Other']}
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
          <Button onClick={handleSubmit(onSubmit, onError)} loading={isLoading}>
            Submit
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
