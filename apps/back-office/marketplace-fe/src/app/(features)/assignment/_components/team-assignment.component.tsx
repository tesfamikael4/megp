'use client';

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@megp/auth';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
import { IconDotsVertical } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  useCreateMutation,
  useLazyReadQuery,
  useLazyListByIdQuery,
} from '../_api/team-members.api';
import { useParams } from 'next/navigation';
import { useLazyGetUsersListQuery } from '@/store/api/rfx-approval/rfx-iam';

export const Members = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { id } = useParams();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const { organizationId } = useAuth();

  const usersConfig: ExpandableTableConfig = {
    isSearchable: true,
    isSelectable: true,
    selectedItems: selectedItems,
    setSelectedItems: setSelectedItems,
    idAccessor: 'personnelId',
    columns: [
      {
        accessor: 'personnelName',
        title: 'Full Name',
      },
    ],
  };
  const config: ExpandableTableConfig = {
    minHeight: 100,
    idAccessor: 'personnelId',
    columns: [
      {
        accessor: 'personnelName',
        title: 'Full Name',
      },
      {
        accessor: 'isTeamLead',
        title: 'Type',
        render: (record) => (record.isTeamLead ? 'Team lead' : 'Member'),
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
                <Menu.Item onClick={() => setTeamlead(record.personnelId)}>
                  Set TeamLead
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  onClick={() => removeMember(record.personnelId)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ),
        width: 100,
      },
    ],
  };

  //rtk
  const [getUsers, { data: users }] = useLazyGetUsersListQuery();
  const [createMembers, { isLoading }] = useCreateMutation();
  const [getTeamMembers, { data: teamMembers }] = useLazyListByIdQuery();

  //event handler
  const onDone = () => {
    const temp: any[] = [];
    selectedItems.map((item) => {
      temp.push({ ...item, isTeamLead: false });
    });

    setMembers(temp);
    close();
  };

  const setTeamlead = (personnelId) => {
    const temp: any[] = [];
    selectedItems.map((item) => {
      if (item.personnelId === personnelId) {
        temp.push({ ...item, isTeamLead: true });
      } else {
        temp.push({ ...item, isTeamLead: false });
      }
    });
    setMembers(temp);
  };

  const removeMember = (personnelId) => {
    const temp = members.filter((item) => item.personnelId !== personnelId);
    setMembers(temp);
  };

  const handleSave = async () => {
    const castedData = {
      members,
      rfxId: id,
    };
    try {
      await createMembers(castedData).unwrap();
      notify('Success', 'Members added successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getTeamMembers({ id: id.toString(), collectionQuery: {} });
  }, []);

  useEffect(() => {
    const temp: any[] = [];
    members.map((member) => {
      temp.push({
        personnelId: member.personnelId,
        personnelName: member.personnelName,
      });
    });
    setSelectedItems(temp);
  }, [members]);

  useEffect(() => {
    if (teamMembers && teamMembers?.total > 0) {
      const temp: any[] = [];
      teamMembers.items.map((member) => {
        temp.push({
          personnelId: member.personnelId,
          personnelName: member.personnelName,
          isTeamLead: member.isTeamLead,
        });
      });
      setMembers(temp);
    }
  }, [teamMembers]);
  return (
    <Section
      title="Team Members"
      collapsible={false}
      action={<Button onClick={open}>Add</Button>}
    >
      <Box className="p-5 bg-white">
        <ExpandableTable data={members} config={config} />
        <Group justify="end" className="my-2">
          <Button loading={isLoading} onClick={handleSave}>
            Save
          </Button>
        </Group>

        <Modal
          opened={opened}
          onClose={close}
          title="Add Team Members"
          size="lg"
        >
          <ExpandableTable
            config={usersConfig}
            onRequestChange={(req) =>
              getUsers({ organizationId, collectionQuery: req })
            }
            data={
              users?.items.map((item) => ({
                personnelId: item.id,
                personnelName: item.firstName + ' ' + item.lastName,
              })) ?? []
            }
            total={users?.total ?? 0}
          />
          <Group justify="end" className="mt-2">
            <Button onClick={onDone}>Done</Button>
          </Group>
        </Modal>
      </Box>
    </Section>
  );
};
