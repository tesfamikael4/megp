import {
  LoadingOverlay,
  Stack,
  Button,
  TextInput,
  Text,
  Group,
  Modal,
  Menu,
  Checkbox,
  Paper,
  Divider,
  Badge,
  Box,
  Flex,
  MenuDropdown,
  Select,
  Switch,
} from '@mantine/core';
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { DragTable, Table, TableConfig } from '@megp/core-fe';
import {
  IconCirclePlus,
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconMenuOrder,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
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
} from '@/store/api/workflow/workflow-iam.api';
import { useAuth } from '@megp/auth';
import { notifications } from '@mantine/notifications';
import {
  useCreateDefaultStepsMutation,
  useCreateStepsMutation,
  useGetDefaultStepsQuery,
} from '@/store/api/workflow/workflow.api';

const Method = ({ cell, selected, setSelected }: any) => {
  // const [value, setValue] = useState<string | null>();

  return (
    <Stack className="w-fit bg-white">
      {(cell.approverType === 'Role' || cell.approverType === 'User') && (
        <Text fz={14}>Anyone</Text>
      )}
      {cell.approverType === 'WorkGroup' && (
        <Select
          placeholder="Pick value"
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

export function Designer() {
  const { id } = useParams();
  const [data, setData] = useState<any>([]);
  const [orderedData, setOrderedData] = useState<any>(data);
  const [opened, { open, close }] = useDisclosure(false);
  const [createSteps, { isLoading: isCreatingSteps }] =
    useCreateDefaultStepsMutation();
  const [checked, setChecked] = useState(false);
  const { data: defaultSteps } = useGetDefaultStepsQuery({
    activityId: id as string,
  });

  useEffect(() => {
    if (defaultSteps) {
      setData([...defaultSteps.items]);
      setOrderedData([...defaultSteps.items]);
    }
  }, [defaultSteps]);

  const listConfig: TableConfig<any> = {
    columns: [
      {
        header: 'Name',
        accessorKey: 'name',
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
    const [selected, setSelected] = useState<any>([]);
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
              checked={
                selected.some((item) => item.name === original.name) ||
                cell.name === original.name
              }
              onChange={(e) => {
                if (e.target.checked) setSelected([...selected, original]);
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
          accessorKey: 'name',
          cell: (info) => info.getValue(),
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
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={15} />}
              onClick={openDeleteModal}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Modal opened={opened} onClose={close} title="Edit Step" size="xl">
          <Stack>
            <Table config={addConfig} data={[]} />
            <Button
              onClick={() => {
                const temp = data.map((item: any) => {
                  if (item.name === cell.name) {
                    return {
                      ...item,
                      ...selected,
                    };
                  }
                  return item;
                });
                setData([...temp]);
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
        <Group>
          <IconGripVertical {...attributes} {...listeners} color="gray" />
          {step.name}
        </Group>
      </div>
    );
  };

  const AddSteps = () => {
    const [selected] = useState<any>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [name, setName] = useState<string>('');

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
          size="md"
        >
          <Stack>
            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* <Flex className="w-full flex-grow" gap={'lg'}>
              {['Role', 'User', 'WorkGroup'].map((e, index) => (
                <>
                  <Paper
                    key={index}
                    withBorder
                    onClick={async () => {
                      setType([...type, e]);
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
            </Flex> */}
            {/* {isSelectorOpened && (
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
                    const newData = [
                      ...data,
                      { ...transformedData, name, id: data.length + 1 },
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
            )} */}
            <Button
              className="ml-auto"
              onClick={() => {
                setData([...data, { name: name, id: data.length + 1 }]);
                setOrderedData([...data, { name: name, id: data.length + 1 }]);
              }}
            >
              Save
            </Button>
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
          title: item.name,
          order: index + 1,
          type: `${checked ? 'mandatory' : 'default'}`,
          activityId: id,
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
              {orderedData.map((step) => (
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
        <Table config={listConfig} data={data} />
        {data.length > 0 && (
          <>
            <Switch
              label="Is order mandatory?"
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
            />
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
