import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Group, ActionIcon, Menu, Flex } from '@mantine/core';
import { IconDotsVertical, IconPencil, IconX } from '@tabler/icons-react';

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

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items?.map((item, index) => {
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Flex
                        justify="space-between"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                        className="border"
                      >
                        {item.displayName}
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
                                  leftSection={<IconPencil size={15} />}
                                  onClick={open}
                                >
                                  Edit
                                </Menu.Item>

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
                      </Flex>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
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
