import {
  Group,
  LoadingOverlay,
  Stack,
  Textarea,
  Text,
  Button,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';
import { Lot } from '@/models/tender/lot';
import {
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../_api/tender/lot.api';
import { modals } from '@mantine/modals';
import { IconTrashX } from '@tabler/icons-react';

interface FormDetailProps {
  lotId: string;
  closeModal: () => void;
}

export function LotFormDetail({
  lotId,
  closeModal,
}: Readonly<FormDetailProps>) {
  const lotSchema: ZodType<Partial<Lot>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(lotSchema),
  });
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(lotId?.toString());

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: lotId });
      notify('Success', 'lot updated successfully');
      closeModal();
    } catch {
      notify('Error', 'Error in updating lot');
    }
  };
  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: `Readvertize Lot`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to readvertize this lot `}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await remove(lotId?.toString())
          .unwrap()
          .then(() => {
            notify('Success', 'lot deleted successfully');
            closeModal();
          })
          .catch(() => {
            notify('Error', 'Error in deleting lot');
          });
      },
    });
  };

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
      });
    }
  }, [reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Textarea
        label="Name"
        withAsterisk
        autosize
        minRows={2}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        {...register('name')}
      />

      <Group className="border-t pt-4">
        <Button
          variant="filled"
          className="my-auto"
          leftSection={<IconTrashX size={14} stroke={1.6} />}
          loading={isUpdating}
          onClick={handleSubmit(onUpdate)}
        >
          Update
        </Button>
        <Button
          color="red"
          className="my-auto"
          leftSection={<IconTrashX size={14} stroke={1.6} />}
          loading={isDeleting}
          onClick={openDeleteModal}
        >
          Re advertize
        </Button>
      </Group>
    </Stack>
  );
}
