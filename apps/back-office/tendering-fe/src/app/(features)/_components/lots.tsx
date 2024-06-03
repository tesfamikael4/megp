import type { Lot } from '@/models/tender/lot';
import { DetailTable } from './detail-table';
import { LotStatusEnum } from '@/models/tender/tender.model';
import { Button, Divider, Modal, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { ZodType, z } from 'zod';
import { useDisclosure } from '@mantine/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateFromLotMutation } from '../preparation/_api/tender/procurement-requisition.api';
import { notify } from '@megp/core-fe';
import { useRouter } from 'next/navigation';

export default function Lot({ lot }: { lot: Lot }) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const lotForm: ZodType<Partial<Lot>> = z.object({
    name: z.string().min(1, { message: 'this field is required' }),
  });
  const config = [
    {
      key: 'Name',
      value: lot.name,
    },
    {
      key: 'Lot Number',
      value: lot.number,
    },
    {
      key: 'Status',
      value: lot.status,
    },
  ];

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(lotForm),
  });

  const [convert, { isLoading: isCreating }] = useCreateFromLotMutation();
  const onCreate = async (data) => {
    try {
      const result = await convert({ ...data, id: lot?.id }).unwrap();
      if (result) router.push(`/${result?.id}?tab=configuration`);
      notify('Success', 'Converted to Tender successfully.');
      close();
    } catch (err) {
      notify('Error', err?.data?.message ?? 'Error while creating Tender.');
      close();
    }
  };

  return (
    <>
      {lot && lot.status === LotStatusEnum.CANCELED && (
        <Button className="ml-auto my-2 flex justify-end" onClick={open}>
          Convert to Tender
        </Button>
      )}
      <DetailTable data={config} />

      <Modal
        opened={opened}
        size={'60%'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Create Tender from Lot
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />

        <TextInput
          withAsterisk
          label="Tender Name"
          error={errors?.name ? errors?.name?.message?.toString() : ''}
          {...register('name')}
        />
        <Button
          variant="filled"
          className="my-2"
          loading={isCreating}
          onClick={handleSubmit(onCreate)}
        >
          Save
        </Button>
      </Modal>
    </>
  );
}
