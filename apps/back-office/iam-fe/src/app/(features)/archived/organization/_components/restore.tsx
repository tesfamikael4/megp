import { Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconDotsVertical, IconRestore } from '@tabler/icons-react';
import { useRestoreMutation } from '../../../organizations/_api/organization.api';
import { notify } from '@megp/core-fe';

export function Restore({ original }: any) {
  const [restore] = useRestoreMutation();

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: `Restore ${original?.name}`,
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to restore  ${original?.name} `}
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
      <Menu shadow="md">
        <Menu.Target>
          <IconDotsVertical className="ml-auto text-gray-500" size={16} />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconRestore size={15} />}
            onClick={openDeleteModal}
          >
            Restore
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
