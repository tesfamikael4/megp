'use client';

import { IconDotsVertical } from '@tabler/icons-react';
import { useLazyGetUsersQuery } from '@/store/api/iam/iam.api';
import { useAuth } from '@megp/auth';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Menu,
  Modal,
  Text,
} from '@mantine/core';
import { ExpandableTable, logger } from '@megp/core-fe';

export const AddMembers = ({
  record,
  onSave,
}: {
  record: any;
  onSave: (data) => void;
}) => {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [getUsers, { data: users }] = useLazyGetUsersQuery();
  const { organizationId } = useAuth();
  const config = {
    columns: [
      {
        accessor: 'fullName',
        title: 'Full Name',
        render: (record) => (
          <p>
            {record.firstName} {record.lastName}
          </p>
        ),
      },
      {
        accessor: 'type',
      },
      {
        accessor: '',
        render: (record) => (
          <Group justify="end">
            <Menu>
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <IconDotsVertical size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setChairMan(record.id)}>
                  Set Chairman
                </Menu.Item>
                <Menu.Item onClick={() => setSecretary(record.id)}>
                  Set Secretary
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onAbort={() => removeMember(record.id)}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ),
        width: 100,
      },
    ],
    minHeight: 100,
  };

  const usersConfig = {
    isSearchable: true,
    isSelectable: true,
    selectedItems: selectedItems,
    setSelectedItems: setSelectedItems,
    columns: [
      {
        accessor: 'fullName',
        title: 'Full Name',
        render: (record) => (
          <p>
            {record.firstName} {record.lastName}
          </p>
        ),
      },
    ],
  };

  const onDone = () => {
    const temp: any[] = [];
    selectedItems.map((item) => {
      if (!members.includes(item)) {
        temp.push({ ...item, type: 'MEMBER' });
      } else {
        const m = members.filter((member) => member.id === item.id);
        temp.push(m[0]);
      }
    });
    setMembers(temp);
    close();
  };

  const setChairMan = (id) => {
    const temp = members.map((member) => {
      if (member.id === id) {
        return { ...member, type: 'CHAIRMAN' };
      } else if (member.type === 'CHAIRMAN') {
        return { ...member, type: 'MEMBER' };
      }
      return member;
    });
    setMembers(temp);
  };
  const setSecretary = (id) => {
    const temp = members.map((member) => {
      if (member.id === id) {
        return { ...member, type: 'SECRETARY' };
      } else if (member.type === 'SECRETARY') {
        return { ...member, type: 'MEMBER' };
      }
      return member;
    });
    setMembers(temp);
  };

  const removeMember = (id) => {
    const temp = members.filter((member) => member.id !== id);
    setMembers(temp);
  };

  const handleOnSave = () => {
    const castedData = members.map((member) => {
      return {
        userId: member.id,
        type: member.type,
      };
    });
    onSave(castedData);
  };
  return (
    <Box className="bg-white p-2">
      {members.length !== 0 && (
        <Box>
          <Flex justify="space-between">
            <Text>Members for {record.name}</Text>
            <Button onClick={open}>Add</Button>
          </Flex>
          <Divider my="sm" />
          <ExpandableTable config={config} data={members} />

          <Group justify="end" className="mt-2">
            <Button onClick={handleOnSave}>Save</Button>
          </Group>
        </Box>
      )}
      {members.length == 0 && (
        <Box className="flex flex-col items-center justify-center p-5 gap-2">
          <Text>No members found</Text>
          <Button variant="outline" onClick={open}>
            Add Members
          </Button>
        </Box>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={500}>Add Members</Text>}
        size="lg"
      >
        <ExpandableTable
          config={usersConfig}
          onRequestChange={(req) =>
            getUsers({ organizationId, collectionQuery: req })
          }
          data={users?.items ?? []}
          total={users?.total ?? 0}
        />
        <Group justify="end" className="mt-2">
          <Button onClick={onDone}>Done</Button>
        </Group>
      </Modal>
    </Box>
  );
};
