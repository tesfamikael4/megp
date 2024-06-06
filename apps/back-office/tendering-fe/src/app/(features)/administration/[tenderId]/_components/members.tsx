'use client';

import { useLazyGetUsersQuery } from '@/store/api/iam/iam-api';
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
import { ExpandableTable, ExpandableTableConfig, notify } from '@megp/core-fe';
import { IconDotsVertical } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  useCreateTeamMemberMutation,
  useLazyGetTeamMembersQuery,
  useLazyGetTeamsByTenderIdQuery,
} from '@/store/api/tendering/tendering.api';
import { useParams } from 'next/navigation';

export const Members = ({ team, collapse, envelopeType, lotId }: any) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { tenderId } = useParams();
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
  const [getUsers, { data: users }] = useLazyGetUsersQuery();
  const [createMembers, { isLoading }] = useCreateTeamMemberMutation();
  const [getTeams, { data: teams }] = useLazyGetTeamsByTenderIdQuery();
  const [getTeamMember, { data: teamMembers }] = useLazyGetTeamMembersQuery();

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
    const lot = lotId ? { lotId } : {};
    const castedData = {
      members,
      team: {
        envelopeType,
        teamType: team.teamType,
        tenderId,
        ...lot,
      },
    };
    try {
      await createMembers(castedData).unwrap();
      notify('Success', 'Members added successfully');
      collapse();
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    const where = lotId
      ? [
          [
            {
              column: 'teamType',
              operator: '=',
              value: team.teamType,
            },
          ],
          [
            {
              column: 'lotId',
              operator: '=',
              value: lotId,
            },
          ],
        ]
      : [
          [
            {
              column: 'teamType',
              operator: '=',
              value: team.teamType,
            },
          ],
        ];
    getTeams({
      tenderId: tenderId as string,
      collectionQuery: {
        where: [...where],
      },
    });
  }, [getTeams, team.teamType, tenderId]);

  useEffect(() => {
    if (teams && teams.total > 0) {
      getTeamMember(teams.items[0].id);
    }
  }, [getTeamMember, teams]);

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
    <Box className="p-5 bg-white">
      <Flex justify="space-between" className="my-2">
        <h1>Add Members for {team.name}</h1>
        <Button onClick={open}>Add</Button>
      </Flex>
      <ExpandableTable data={members} config={config} />
      <Group justify="end" className="my-2">
        <Button loading={isLoading} onClick={handleSave}>
          Save
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title="Add Bid Evaluator"
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
  );
};
