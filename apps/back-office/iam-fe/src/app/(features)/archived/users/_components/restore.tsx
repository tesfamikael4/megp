import { Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconDotsVertical, IconRestore } from '@tabler/icons-react';
import { useRestoreMutation } from '../../../../users/_api/user.api';
import { notify } from '@megp/core-fe';

export function Restore({ original }: any) {
  const [restore] = useRestoreMutation();

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: `Restore ${original?.account?.firstName} ${original?.account?.lastName}`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to restore  ${original?.account?.firstName} ${original?.account?.lastName} `}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: handleDelete,
    });
  };
  const handleDelete = async () => {
    try {
      await restore(original?.id).unwrap();
      notify('Success', 'Restored Success-fully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  return (
    <>
      <IconRestore
        size="15"
        className="ml-auto"
        onClick={openDeleteModal}
        color="#222261"
      />
    </>
  );
}
