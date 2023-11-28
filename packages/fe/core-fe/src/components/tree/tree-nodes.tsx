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
      w={300}
    >
      <Text truncate="end">{node[fields.title]}</Text>
    </Box>
  );
}

interface CheckboxTreeNodeProps extends NodesFields {
  node: any;
  onSelect: (node: any, isChecked: boolean) => void;
  checked: boolean;
  disableParentSelect: boolean;
}

export function CheckBoxTreeNode({
  node,
  onSelect,
  checked,
  fields,
  disableParentSelect,
}: CheckboxTreeNodeProps): ReactNode {
  const isLeaf = !node[fields.children ?? 'children']?.length;

  return (
    <Box w={200}>
      <Flex align="center">
        {disableParentSelect ? (
          isLeaf && (
            <Checkbox
              checked={checked}
              className="mr-1"
              onChange={(data) => {
                onSelect(node, data.target.checked);
              }}
              size="xs"
            />
          )
        ) : (
          <Checkbox
            checked={checked}
            className="mr-1"
            onChange={(data) => {
              onSelect(node, data.target.checked);
            }}
            size="xs"
          />
        )}
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
  disableParentSelect: boolean;
}

export function RadioTreeNode({
  node,
  onSelect,
  selectedKey,
  fields,
  disableParentSelect,
}: RadioTreeNodeProps): ReactNode {
  const handleRadioChange = (): void => {
    onSelect(node);
  };
  const isLeaf = !node[fields.children ?? 'children']?.length;

  return (
    <Box w={200}>
      <Flex align="center">
        {disableParentSelect ? (
          isLeaf && (
            <Radio
              checked={selectedKey[fields.key] === node[fields.key]}
              // className="text-ellipsis "
              onChange={handleRadioChange}
              size="xs"
            />
          )
        ) : (
          <Radio
            checked={selectedKey[fields.key] === node[fields.key]}
            // className="text-ellipsis "
            onChange={handleRadioChange}
            size="xs"
          />
        )}
        <Text className="ml-4" truncate="end">
          {node[fields.title]}
        </Text>
      </Flex>
    </Box>
  );
}
