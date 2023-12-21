import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrashX } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

interface DeleteButtonProps {
  onDelete: () => void;
  isDeleting?: boolean;
  entity?: string;
  disabled?: boolean;
}

export function DeleteButton({
  onDelete,
  isDeleting,
  entity,
  disabled,
}: DeleteButtonProps): React.ReactElement {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const entityName = parts[1];

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: `Delete ${entity ? entity : entityName}`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to delete this ${
            entity ? entity : entityName
          } `}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        onDelete();
      },
    });
  };

  return (
    <Button
      color="red"
      disabled={disabled}
      leftSection={<IconTrashX size={14} stroke={1.6} />}
      loading={isDeleting}
      onClick={openDeleteModal}
    >
      Delete
    </Button>
  );
}
