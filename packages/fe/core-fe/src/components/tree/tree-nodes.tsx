import { Box, Checkbox, Flex, Radio, Text } from '@mantine/core';
import type { ReactNode } from 'react';

interface NodesFields {
  fields: { title: string; key: string; children?: string };
}

interface TreeNodeProps extends NodesFields {
  node: any;
  onSelect: (node: any) => void;
}

export function TreeNode({ node, onSelect, fields }: TreeNodeProps): ReactNode {
  return (
    <Box
      className="ml-2"
      onClick={() => {
        onSelect(node);
      }}
      w={200}
    >
      <Text truncate="end">{node[fields.title]}</Text>
    </Box>
  );
}

interface CheckboxTreeNodeProps extends NodesFields {
  node: any;
  onSelect: (node: any, isChecked: boolean) => void;
  checked: boolean;
}

export function CheckBoxTreeNode({
  node,
  onSelect,
  checked,
  fields,
}: CheckboxTreeNodeProps): ReactNode {
  return (
    <Box w={200}>
      <Flex align="center">
        <Checkbox
          checked={checked}
          className="mr-1"
          onChange={(data) => {
            onSelect(node, data.target.checked);
          }}
          size="xs"
        />
        <Text className="ml-4" truncate="end">
          {node[fields.title]}
        </Text>
      </Flex>
    </Box>
  );
}

interface RadioTreeNodeProps extends NodesFields {
  node: any;
  onSelect: (node: any) => void;
  selectedKey: any;
}

export function RadioTreeNode({
  node,
  onSelect,
  selectedKey,
  fields,
}: RadioTreeNodeProps): ReactNode {
  const handleRadioChange = (): void => {
    onSelect(node);
  };

  return (
    <Box w={200}>
      <Flex align="center">
        <Radio
          checked={selectedKey === node}
          // className="text-ellipsis "
          onChange={handleRadioChange}
          size="xs"
        />
        <Text className="ml-4" truncate="end">
          {node[fields.title]}
        </Text>
      </Flex>
    </Box>
  );
}
