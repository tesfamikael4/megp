import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrashX } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

interface DeleteButtonProps {
  onDelete: () => void;
  isDeleting?: boolean;
  entity?: string;
  disabled?: boolean;
  message: string;
  title: string;
  buttonName: string;
}

export function DeleteButton({
  onDelete,
  isDeleting,
  entity,
  disabled,
  message,
  title,
  buttonName,
}: DeleteButtonProps): React.ReactElement {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const entityName = parts[1];

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: title,
      centered: true,
      children: <Text size="sm">{message}</Text>,
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
      {buttonName}
    </Button>
  );
}
