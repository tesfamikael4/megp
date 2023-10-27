import React, { useState } from 'react';
import { Text, Box, ActionIcon } from '@mantine/core';
import { IconArrowDown, IconArrowRight, IconFile } from '@tabler/icons-react';

interface TreeNode {
  id: string;
  name: string;
  code: string;
  children?: TreeNode[];
}

interface TreeViewProps {
  items: TreeNode[];
}

export const TreeView: React.FC<TreeViewProps> = ({ items }) => {
  const TreeBuilder: React.FC<{ data: TreeNode }> = ({ data }) => {
    const [isOpened, setIsOpened] = useState(false);

    const toggleExpandeble = () => {
      setIsOpened(!isOpened);
    };

    return (
      <Box className="ml-5 mt-2">
        <Box className="flex">
          {data.children?.length !== 0 && (
            <ActionIcon
              className="mr-2 mt-2"
              color="primary"
              onClick={toggleExpandeble}
              size={15}
              variant="outline"
            >
              {isOpened ? (
                <IconArrowDown size={10} stroke={1} />
              ) : (
                <IconArrowRight size={10} stroke={1} />
              )}
            </ActionIcon>
          )}
          {data.children?.length === 0 && (
            <ActionIcon
              className="mr-2"
              color="primary"
              size={15}
              variant="outline"
            >
              <IconFile size={10} stroke={1} />
            </ActionIcon>
          )}
          <Text fw={600}>{`[${data.code}]:${data.name}`}</Text>
        </Box>
        {isOpened && (
          <>
            {data.children?.map((node) => (
              <TreeBuilder data={node} key={node.id} />
            ))}
          </>
        )}
      </Box>
    );
  };

  return (
    <>
      {items.map((node) => (
        <TreeBuilder data={node} key={node.id} />
      ))}
    </>
  );
};
