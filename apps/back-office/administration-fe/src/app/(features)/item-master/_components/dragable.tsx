import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Group, ActionIcon, Menu, Flex, Table } from '@mantine/core';
import { IconDotsVertical, IconPencil, IconX } from '@tabler/icons-react';
import { logger } from '@megp/core-fe';

export const DraggableTable = ({
  data,
  remove,
  setUpdatedItems,
  open,
}: {
  data;
  remove;
  setUpdatedItems;
  open;
}) => {
  const [items, setItems] = useState(data);
  useEffect(() => {
    setItems(data);
  }, [data]);

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const _items = reorder(
      items,
      result.source.index,
      result.destination.index,
    );

    const newitems = _items?.map((item, index) => {
      return { ...item, order: index };
    });
    setUpdatedItems(newitems);

    setItems(_items);
  }

  useEffect(() => {
    const _items = items?.map((item, index) => {
      return { ...item, order: index };
    });
    setUpdatedItems(_items);
  }, []);
  logger.log(items);
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <Table
              withTableBorder
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <Table.Thead bg={'#DDDCEE'}>
                <Table.Tr>
                  <Table.Th>Display Name</Table.Th>
                  <Table.Th>Input Type</Table.Th>
                  <Table.Th>
                    <Group justify="end">Actions</Group>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items?.map((item, index) => {
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Table.Tr
                          // justify="space-between"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                          // className="border"
                        >
                          <Table.Td>{item.displayName}</Table.Td>
                          <Table.Td>
                            {item.dataType === 'string'
                              ? 'Text input'
                              : item.dataType === 'number'
                                ? 'Number'
                                : item.dataType === 'singleSelect'
                                  ? 'Single Select'
                                  : item.dataType === 'multiSelect'
                                    ? 'Multiple Select'
                                    : 'Checkbox'}
                          </Table.Td>
                          <Table.Td>
                            {' '}
                            <Group>
                              <ActionIcon
                                color="primary"
                                variant="subtle"
                                className="ml-auto"
                              >
                                <Menu shadow="md" width={200}>
                                  <Menu.Target>
                                    <IconDotsVertical size={18} />
                                  </Menu.Target>
                                  <Menu.Dropdown>
                                    <Menu.Item
                                      color="red"
                                      leftSection={<IconX size={15} />}
                                      onClick={() => remove(item.key)}
                                    >
                                      Remove
                                    </Menu.Item>
                                  </Menu.Dropdown>
                                </Menu>
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Draggable>
                  );
                })}
              </Table.Tbody>

              {provided.placeholder}
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? '#DDDCEE' : 'white',
  display: isDragging && 'flex',
  justifyContent: isDragging && 'space-between',
  ...draggableStyle,
  padding: '5px',
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver && '#white',
  padding: '5px',
});

const reorder = (list, startIndex, endIndex): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
