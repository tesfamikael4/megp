import {
  Stack,
  Button,
  TextInput,
  Text,
  Group,
  Modal,
  Menu,
  Checkbox,
  Paper,
  Badge,
  Flex,
  Select,
  Loader,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Table, TableConfig } from '@megp/core-fe';
import {
  IconCirclePlus,
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconMenuOrder,
  IconTrash,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical } from '@tabler/icons-react';
import {
  useLazyGetGroupsQuery,
  useLazyGetRolesQuery,
  useLazyGetUsersQuery,
} from '@/store/api/planning-approval/planning-iam';
import { useAuth } from '@megp/auth';
import { notifications } from '@mantine/notifications';
import {
  useCreateStepsMutation,
  useGetDefaultStepsQuery,
  useGetStepsQuery,
} from '@/store/api/planning-approval/planning-approval';

const Method = ({ cell, selected, setSelected }: any) => {
  const [value, setValue] = useState<string | null>();

  return (
    <Stack className="w-fit bg-white">
      {cell.approverType === 'Role' && <Text fz={14}>Anyone</Text>}
      {cell.approverType === 'User' && <Text fz={14}>Assign User</Text>}
      {cell.approverType === 'WorkGroup' && (
        <Select
          placeholder="Pick value"
          onChange={setValue}
          value={value}
          onOptionSubmit={(value) => {
            const temp = selected.map((item: any) => {
              if (item.approver === cell.approver) {
                return {
                  ...item,
                  approvalMethod: value,
                };
              }
              return item;
            });
            setSelected([...temp]);
          }}
          defaultValue="Majority"
          data={['Majority', 'Consensus']}
        />
      )}
    </Stack>
  );
};

export function Steps({
  activityId,
  key,
}: {
  activityId: string;
  key?: string;
}) {
  const { user } = useAuth();
  const [data, setData] = useState<any>([]);
  const [orderedData, setOrderedData] = useState<any>(data);
  const [opened, { open, close }] = useDisclosure(false);
  const { data: defaultSteps, isLoading: isFetchingDefaultSteps } =
    useGetDefaultStepsQuery({
      activityId: activityId,
    });
  const { data: steps, isLoading: isFetchingSteps } = useGetStepsQuery({
    activityId: activityId,
  });
  const [createSteps, { isLoading: isCreatingSteps }] =
    useCreateStepsMutation();

  useEffect(() => {
    if (steps?.total != 0) {
      setData(steps?.items);
      setOrderedData(steps?.items);
    } else {
      setData(defaultSteps?.items);
      setOrderedData(defaultSteps?.items);
    }
  }, [defaultSteps, steps]);

  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'title',
      },
      {
        header: 'Approver',
        accessorKey: 'approvers',
        cell: ({ row: { original } }: any) => (
          <Multiple cell={original} col={'approver'} />
        ),
      },
      {
        header: 'Approver Type',
        accessorKey: 'approverTypes',
        cell: ({ row: { original } }: any) => (
          <Multiple cell={original} col={'approverType'} />
        ),
      },
      {
        header: 'Approval Method',
        accessorKey: 'approvalMethods',
        cell: ({ row: { original } }: any) => (
          <Multiple cell={original} col={'approvalMethod'} />
        ),
      },
      {
        header: 'Action',
        accessorKey: 'action',
        cell: ({ row: { original } }: any) => <Action cell={original} />,
      },
    ],
  };

  const Action = ({ cell }: any) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [selected, setSelected] = useState<any>(
      Array.from(new Set(cell?.approvers ?? [])),
    );
    const [name, setName] = useState(cell.title);
    const [isSelectorOpened, setIsSelectorOpened] = useState(true);
    const [type, setType] = useState<string[]>(
      Array.from(
        new Set(
          cell?.approvers?.map((approver) => approver.approverType) ?? [],
        ),
      ),
    );
    const [getRoles, { data: rolesList }] = useLazyGetRolesQuery();
    const [getGroups, { data: groupsList }] = useLazyGetGroupsQuery();
    const [getUsers, { data: usersList }] = useLazyGetUsersQuery();

    useEffect(() => {
      handleAssignment({ type: type });
    }, [type]);

    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);

    const handleAssignment = async ({ type }: { type: string[] }) => {
      try {
        {
          type.includes('Role') &&
            (await getRoles({
              id: user?.organizations?.[0].organization.id,
            }).unwrap());
        }
        {
          type.includes('WorkGroup') &&
            (await getGroups({
              id: user?.organizations?.[0].organization.id,
            }).unwrap());
        }
        {
          type.includes('User') &&
            (await getUsers({
              id: user?.organizations?.[0].organization.id,
            }).unwrap());
        }
      } catch (err) {
        notifications.show({
          title: 'Error',
          message: 'Error fetching',
        });
      }
    };

    useEffect(() => {
      const reformmatedRole = rolesList?.items.map((role) => {
        return {
          approver: role.name,
          approvalMethod: 'Anyone',
          id: role.id,
          approverType: 'Role',
        };
      });
      setRoles(reformmatedRole);
    }, [rolesList]);

    useEffect(() => {
      const reformmatedUsers = usersList?.items.map((user) => {
        return {
          approver: `${user.firstName} ${user.lastName}`,
          approvalMethod: 'Assign User',
          id: user.id,
          approverType: 'User',
        };
      });
      setUsers(reformmatedUsers);
    }, [usersList]);

    useEffect(() => {
      const reformmatedGroup = groupsList?.items.map((group) => {
        return {
          approver: group.name,
          approvalMethod: 'Majority',
          id: group.id,
          approverType: 'WorkGroup',
        };
      });
      setGroups(reformmatedGroup);
    }, [groupsList]);

    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete ${cell.name}`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this ${cell.name} `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };

    const handleDelete = () => {
      const temp = data.filter((item: any) => item.name !== cell.name);
      setData([...temp]);
    };

    const addConfig: TableConfig<any> = {
      columns: [
        {
          id: 'select',
          header: '',
          accessorKey: 'select',
          cell: ({ row: { original } }: any) => (
            <Checkbox
              checked={selected.some(
                (item) => item.approver === original.approver,
              )}
              onChange={(e) => {
                if (e.target.checked) setSelected([original]);
                else {
                  setSelected([
                    ...selected.filter((s) => s.id !== original.id),
                  ]);
                }
              }}
            />
          ),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'approver',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'approvalMethods',
          header: 'Approval Method',
          accessorKey: 'approvalMethod',
          cell: ({ row: { original } }: any) => (
            <Method
              cell={original}
              setSelected={setSelected}
              selected={selected}
            />
          ),
          meta: {
            widget: 'primary',
          },
        },
      ],
    };

    return (
      <>
        <Menu shadow="md">
          <Menu.Target>
            <IconDotsVertical className="ml-auto text-gray-500" size={16} />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEdit size={15} />} onClick={open}>
              Edit
            </Menu.Item>
            <Menu.Divider />
            {cell.type !== 'default' && cell.type !== 'mandatory' && (
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={15} />}
                onClick={openDeleteModal}
              >
                Delete
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>

        <Modal opened={opened} onClose={close} title="Edit Step" size="xl">
          <Stack>
            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={cell.type === 'default' || cell.type === 'mandatory'}
            />
            {/* <Table config={addConfig} data={[]} /> */}
            <Flex className="w-full flex-grow" gap={'lg'}>
              {['Role', 'User', 'WorkGroup'].map((e, index) => (
                <>
                  <Paper
                    key={index}
                    withBorder
                    onClick={async () => {
                      if (!type.includes(e)) setType([...type, e]);
                      await handleAssignment({ type: [e] });
                      setIsSelectorOpened(true);
                    }}
                    className="w-1/3 shadow-sm bg-gray-100 flex justify-center py-4 gap-1 cursor-pointer"
                  >
                    <IconCirclePlus />
                    {e}
                  </Paper>
                </>
              ))}
            </Flex>
            {isSelectorOpened && (
              <>
                {type.map((type) => (
                  <>
                    <Paper withBorder p="md">
                      <Stack>
                        <Text>{type}</Text>
                        {(roles || groups || users) && (
                          <Table
                            config={addConfig}
                            data={
                              type === 'Role' && roles
                                ? roles
                                : type === 'WorkGroup' && groups
                                  ? groups
                                  : type === 'User' && users
                                    ? users
                                    : []
                            }
                          />
                        )}
                      </Stack>
                    </Paper>
                  </>
                ))}
              </>
            )}
            <Button
              onClick={() => {
                const approvers = selected.map((item) => {
                  return { ...item };
                });
                const temp = data.map((item: any) => {
                  if (item.name === cell.name) {
                    const selectedApprovers = approvers.filter((approver) => {
                      return approver.id !== item.id;
                    });
                    return {
                      ...item,
                      approvers: [...selectedApprovers],
                    };
                  }
                  return item;
                });
                setData([...temp]);
                setOrderedData([...temp]);
              }}
              className="ml-auto"
            >
              Save
            </Button>
          </Stack>
        </Modal>
      </>
    );
  };

  const SortableData = ({ step }: { step: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: step.id });
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };

    return (
      <div ref={setNodeRef} style={style} className="step">
        <Paper withBorder className="shadow-sm">
          <Group>
            <IconGripVertical {...attributes} {...listeners} color="gray" />
            {step.name}
          </Group>
        </Paper>
      </div>
    );
  };

  const Multiple: any = ({ cell, col }: any) => {
    return (
      <Stack gap="sm">
        {cell.approvers?.map((e, index) => {
          return (
            <Badge key={index} color="#898989">
              {e[col]}
            </Badge>
          );
        })}
      </Stack>
    );
  };

  const AddSteps = () => {
    const [selected, setSelected] = useState<any>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [isSelectorOpened, setIsSelectorOpened] = useState(false);
    const [type, setType] = useState<string[]>([]);
    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [getRoles, { data: rolesList }] = useLazyGetRolesQuery();
    const [getGroups, { data: groupsList }] = useLazyGetGroupsQuery();
    const [getUsers, { data: usersList }] = useLazyGetUsersQuery();

    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);

    const handleAssignment = async ({ type }) => {
      try {
        {
          type.includes('Role') &&
            (await getRoles({
              id: user?.organizations?.[0].organization.id,
            }).unwrap());
        }
        {
          type.includes('WorkGroup') &&
            (await getGroups({
              id: user?.organizations?.[0].organization.id,
            }).unwrap());
        }
        {
          type.includes('User') &&
            (await getUsers({
              id: user?.organizations?.[0].organization.id,
            }).unwrap());
        }
      } catch (err) {
        notifications.show({
          title: 'Error',
          message: 'Error fetching',
        });
      }
    };

    useEffect(() => {
      const reformmatedRole = rolesList?.items.map((role) => {
        return {
          approver: role.name,
          approvalMethod: 'Anyone',
          id: role.id,
          approverType: 'Role',
        };
      });
      setRoles(reformmatedRole);
    }, [rolesList]);

    useEffect(() => {
      const reformmatedUsers = usersList?.items.map((user) => {
        return {
          approver: `${user.firstName} ${user.lastName}`,
          approvalMethod: 'Assign User',
          id: user.id,
          approverType: 'User',
        };
      });
      setUsers(reformmatedUsers);
    }, [usersList]);

    useEffect(() => {
      const reformmatedGroup = groupsList?.items.map((group) => {
        return {
          approver: group.name,
          approvalMethod: 'Majority',
          id: group.id,
          approverType: 'WorkGroup',
        };
      });
      setGroups(reformmatedGroup);
    }, [groupsList]);

    const addConfig: TableConfig<any> = {
      columns: [
        {
          id: 'select',
          header: '',
          accessorKey: 'select',
          cell: ({ row: { original } }: any) => (
            <Checkbox
              checked={selected.some(
                (item) => item.approver === original.approver,
              )}
              onChange={(e) => {
                if (e.target.checked) setSelected([original]);
                else {
                  setSelected([
                    ...selected.filter((s) => s.id !== original.id),
                  ]);
                }
              }}
            />
          ),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'approver',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'approvalMethods',
          header: 'Approval Method',
          accessorKey: 'approvalMethod',
          cell: ({ row: { original } }: any) => (
            <Method
              cell={original}
              setSelected={setSelected}
              selected={selected}
            />
          ),
          meta: {
            widget: 'primary',
          },
        },
      ],
    };

    const transformedData = {};

    selected.forEach((item) => {
      for (const key in item) {
        if (key !== 'id') {
          if (transformedData[key] === undefined) {
            transformedData[key] = [];
          }
          transformedData[key].push(item[key]);
        }
      }
    });

    return (
      <>
        <Modal
          opened={opened}
          onClose={close}
          title="Add Custom Step"
          size="xl"
        >
          <Stack>
            <TextInput
              label="Name"
              withAsterisk
              value={name}
              onChange={(e) => {
                setNameError('');
                setName(e.target.value);
              }}
              error={nameError}
            />

            <Flex className="w-full flex-grow" gap={'lg'}>
              {['Role', 'User', 'WorkGroup'].map((e, index) => (
                <>
                  <Paper
                    key={index}
                    withBorder
                    onClick={async () => {
                      if (!type.includes(e)) setType([...type, e]);
                      await handleAssignment({ type: e });
                      setIsSelectorOpened(true);
                    }}
                    className="w-1/3 shadow-sm bg-gray-100 flex justify-center py-4 gap-1 cursor-pointer"
                  >
                    <IconCirclePlus />
                    {e}
                  </Paper>
                </>
              ))}
            </Flex>
            {isSelectorOpened && (
              <>
                {type.map((type) => (
                  <>
                    <Paper withBorder p="md">
                      <Stack>
                        <Text>{type}</Text>
                        {(roles || groups || users) && (
                          <Table
                            config={addConfig}
                            data={
                              type === 'Role' && roles
                                ? roles
                                : type === 'WorkGroup' && groups
                                  ? groups
                                  : type === 'User' && users
                                    ? users
                                    : []
                            }
                          />
                        )}
                      </Stack>
                    </Paper>
                  </>
                ))}

                <Button
                  onClick={() => {
                    if (!name) {
                      setNameError('Name is required');
                      return;
                    }
                    if (data.some((item) => item.title === name)) {
                      setNameError('Name already exists');
                      return;
                    }
                    const approvers = selected.map((item) => {
                      return { ...item };
                    });
                    const newData = [
                      ...data,
                      {
                        approvers: [...approvers],
                        title: name,
                        id: data.length + 1,
                        type: 'custom',
                      },
                    ];
                    setData(newData);
                    setOrderedData(newData);
                    close();
                    setSelected([]);
                  }}
                  className="ml-auto"
                >
                  Save
                </Button>
              </>
            )}
          </Stack>
        </Modal>
        <Button leftSection={<IconCirclePlus size={18} />} onClick={open}>
          Add Steps
        </Button>
      </>
    );
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setOrderedData((data) => {
      const oldIndex = data.findIndex((step) => step.id === active.id);
      const newIndex = data.findIndex((step) => step.id === over.id);
      return arrayMove(data, oldIndex, newIndex);
    });
  };

  const onSave = async () => {
    try {
      const reformattedData = data.map((item, index) => {
        return {
          approvers: item.approvers,
          title: item.title,
          order: index + 1,
          type: item.type,
          activityId: activityId,
        };
      });
      await createSteps(reformattedData).unwrap();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: 'Steps saved succcessfully.',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error saving steps',
      });
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Change step order"
        size="xl"
      >
        <Stack>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              items={orderedData}
              strategy={verticalListSortingStrategy}
            >
              {orderedData?.map((step) => (
                <SortableData key={step.id} step={step} />
              ))}
            </SortableContext>
            {/* <DragOverlay>
              {activeId ? <Text>{activeId}</Text> : null}
            </DragOverlay> */}
          </DndContext>
          <Button
            className="ml-auto"
            onClick={() => {
              setData([...orderedData]);
              close();
            }}
          >
            Save
          </Button>
        </Stack>
      </Modal>
      <Stack pos="relative">
        <Group className="ml-auto">
          <AddSteps />
          <Button leftSection={<IconMenuOrder size={18} />} onClick={open}>
            Order
          </Button>
        </Group>
        {(isFetchingSteps || isFetchingDefaultSteps) && (
          <div className="flex justify-center items-center w-full">
            <Loader />
          </div>
        )}
        {data && <Table config={listConfig} data={data ?? []} />}
        {data?.length > 0 && (
          <>
            <Button
              className="ml-auto"
              leftSection={<IconDeviceFloppy size={18} />}
              onClick={async () => {
                await onSave();
              }}
              loading={isCreatingSteps}
            >
              Save
            </Button>
          </>
        )}
      </Stack>
    </>
  );
}
