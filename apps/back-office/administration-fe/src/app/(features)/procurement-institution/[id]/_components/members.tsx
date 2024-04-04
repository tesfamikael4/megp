'use client';

import { IconDotsVertical } from '@tabler/icons-react';
import {
  useLazyGetAdhocMembersQuery,
  useLazyGetIpdcMembersQuery,
  useLazyGetUsersQuery,
  useUpdateAdhocStatusMutation,
  useUpdateIpdcStatusMutation,
} from '@/store/api/iam/iam.api';
import { useAuth } from '@megp/auth';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Text,
} from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, notify } from '@megp/core-fe';

export const AddMembers = ({
  record,
  onSave,
  page,
}: {
  record: any;
  onSave: (data) => void;
  page: 'ipdc' | 'adhoc';
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
                <Menu.Item onClick={() => setChairMan(record.userId)}>
                  Set Chairperson
                </Menu.Item>
                <Menu.Item onClick={() => setSecretary(record.userId)}>
                  Set Secretary
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  onClick={() => removeMember(record.userId)}
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
    minHeight: 100,
  };

  const usersConfig: ExpandableTableConfig = {
    isSearchable: true,
    isSelectable: true,
    selectedItems: selectedItems,
    setSelectedItems: setSelectedItems,
    idAccessor: 'userId',
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
        temp.push({
          firstName: item.firstName,
          lastName: item.lastName,
          userId: item.userId,
          type: 'MEMBER',
        });
      } else {
        const m = members.filter((member) => member.userId === item.id);
        temp.push(m[0]);
      }
    });
    setMembers(temp);
    close();
  };

  const setChairMan = (id) => {
    const temp = members.map((member) => {
      if (member.userId === id) {
        return { ...member, type: 'CHAIRPERSON' };
      } else if (member.type === 'CHAIRPERSON') {
        return { ...member, type: 'MEMBER' };
      }
      return member;
    });
    setMembers(temp);
  };
  const setSecretary = (id) => {
    const temp = members.map((member) => {
      if (member.userId === id) {
        return { ...member, type: 'SECRETARY' };
      } else if (member.type === 'SECRETARY') {
        return { ...member, type: 'MEMBER' };
      }
      return member;
    });
    setMembers(temp);
  };

  const removeMember = (id) => {
    const temp = members.filter((member) => member.userId !== id);
    setMembers(temp);
  };

  const handleOnSave = () => {
    const castedData = members.map((member) => {
      return {
        userId: member.userId,
        type: member.type,
      };
    });
    onSave(castedData);
  };

  //rtk
  const [getIpdcMembers, { data: ipdcMember, isLoading: ipdcMemberLoading }] =
    useLazyGetIpdcMembersQuery();
  const [
    getAdhocMembers,
    { data: adhocMember, isLoading: adhocMemberLoading },
  ] = useLazyGetAdhocMembersQuery();
  const [updateIpdc, { isLoading: ipdcLoading }] =
    useUpdateIpdcStatusMutation();
  const [updateAdhoc, { isLoading: adhocLoading }] =
    useUpdateAdhocStatusMutation();

  const changeStatus = async (status: 'ACTIVE' | 'INACTIVE') => {
    try {
      if (page == 'ipdc') {
        await updateIpdc({
          id: record.id,
          status,
        }).unwrap();
      } else if (page == 'adhoc') {
        await updateAdhoc({
          id: record.id,
          status,
        }).unwrap();
      }
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  //use Effect
  useEffect(() => {
    if (page == 'ipdc') {
      getIpdcMembers({
        id: record.id,
      });
    } else if (page == 'adhoc') {
      getAdhocMembers({
        id: record.id,
      });
    }
  }, [getAdhocMembers, getIpdcMembers, page, record]);

  useEffect(() => {
    if (page === 'ipdc' && ipdcMember?.items)
      setMembers(
        ipdcMember?.items?.map((member) => ({
          userId: member.userId,
          type: member.type,
          firstName: member.firstName,
          lastName: member.lastName,
        })) ?? [],
      );

    if (page === 'adhoc' && adhocMember?.items)
      setMembers(adhocMember?.items ?? []);
  }, [adhocMember, ipdcMember, page]);

  useEffect(() => {
    const temp = members.map((member) => ({
      userId: member.userId,
      firstName: member.firstName,
      lastName: member.lastName,
    }));
    setSelectedItems(temp);
  }, [members]);
  return (
    <Box className="bg-white p-5 border mb-5" pos={'relative'}>
      <LoadingOverlay visible={ipdcMemberLoading || adhocMemberLoading} />
      {members.length !== 0 && (
        <Box>
          <Flex justify="space-between">
            <Text>Members for {record.name}</Text>
            <Button onClick={open}>Add</Button>
          </Flex>
          <Divider my="sm" />
          <ExpandableTable config={config} data={members} />

          <Group justify="end" className="mt-2">
            {record.status !== 'ACTIVE' && (
              <Button
                onClick={() => changeStatus('ACTIVE')}
                loading={ipdcLoading || adhocLoading}
              >
                Activate
              </Button>
            )}
            {record.status === 'ACTIVE' && (
              <Button
                onClick={() => changeStatus('INACTIVE')}
                color="red"
                loading={ipdcLoading || adhocLoading}
              >
                Deactivate
              </Button>
            )}
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
          data={
            users?.items.map((item) => ({
              userId: item.id,
              firstName: item.firstName,
              lastName: item.lastName,
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
