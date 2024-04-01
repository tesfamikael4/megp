import {
  Stack,
  Button,
  TextInput,
  Text,
  Group,
  Modal,
  Menu,
  Select,
  Switch,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
import { notifications } from '@mantine/notifications';
import {
  useCreateDefaultStepsMutation,
  useGetDefaultStepsQuery,
} from '@/store/api/workflow/workflow.api';

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
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
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

    return (
      <>
        <Menu shadow="md">
          <Menu.Target>
            <IconDotsVertical className="ml-auto text-gray-500" size={16} />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={15} />}
              onClick={() => {
                setName(cell?.name);
                open();
              }}
            >
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
            <TextInput
              label="Name"
              value={name}
              error={nameError}
              onChange={(e) => {
                setNameError('');
                setName(e.target.value);
              }}
            />
            <Button
              onClick={() => {
                if (!name) {
                  setNameError('Name is required');
                  return;
                }
                const editedData = data?.map((entry) => {
                  if (entry?.name == cell?.name) {
                    return {
                      ...entry,
                      name: name,
                    };
                  }
                  return entry;
                });
                setData(editedData);
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
    const [nameError, setNameError] = useState<string>('');

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
              withAsterisk
              value={name}
              error={nameError}
              onChange={(e) => {
                setNameError('');
                setName(e.target.value);
              }}
            />

            <Button
              className="ml-auto"
              onClick={() => {
                if (!name) {
                  setNameError('Name is required');
                  return;
                }
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
