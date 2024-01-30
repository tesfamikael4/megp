import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconToggleLeft, IconToggleRight } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

interface DeleteButtonProps {
  onActivate?: () => void;
  isActivating?: boolean;
  data: any;
  entity?: string;
}

export function ActivateButton({
  onActivate,
  isActivating,
  entity,
  data,
}: DeleteButtonProps): React.ReactElement {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const entityName = parts[1];

  const openActivateModal = () => {
    modals.openConfirmModal({
      title: `${data?.status === 'ACTIVATE' ? 'Deactivate' : 'Activate'} ${
        entity ? entity : entityName
      }`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to ${
            data?.status === 'ACTIVATE' ? 'deactivate' : 'activate'
          } this ${entity ? entity : entityName} `}
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        onActivate && onActivate();
      },
    });
  };

  return (
    <Button
      color={data?.status === 'ACTIVATE' ? 'red' : ''}
      leftSection={
        data?.isActive ? (
          <IconToggleLeft size={14} stroke={1.6} />
        ) : (
          <IconToggleRight size={14} stroke={1.6} />
        )
      }
      loading={isActivating}
      onClick={openActivateModal}
      type="submit"
    >
      {data?.status === 'ACTIVATE' ? 'Deactivate' : 'Activate'}
    </Button>
  );
}
