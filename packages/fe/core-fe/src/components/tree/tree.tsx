'use client';

import { Box, Button, Group, Modal, TextInput } from '@mantine/core';
import RcTree from 'rc-tree';
import { useDisclosure } from '@mantine/hooks';
import 'rc-tree/assets/index.css';
// import type { Key } from 'rc-tree/lib/interface';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import type { DataNode } from 'rc-tree/lib/interface';
import { CheckBoxTreeNode, RadioTreeNode, TreeNode } from './tree-nodes';

interface TreeProps<T> {
  data: T[];
  mode: 'view' | 'select';
  multiSelect?: boolean;
  fieldNames: { title: string; key: string; children?: string };
  clickedKeys?: string[];
  selectedKeys?: Partial<T> | Partial<T[]>;
  onClick?: (node: Partial<T>, parents?: Partial<T[]> | null) => void;
  onDone?: (selectedKey: Partial<T> | Partial<T[]>) => void;
  label?: string;
  placeholder?: string;
}

export function Tree<T extends { key: string }>({
  mode,
  data,
  onClick,
  onDone,
  selectedKeys,
  fieldNames,
  clickedKeys = [],
  label = '',
  placeholder = '',
  multiSelect = false,
}: TreeProps<T>): ReactNode {
  const [checkedKey, setCheckedKey] = useState<Partial<T>>({});
  const [checkedKeys, setCheckedKeys] = useState<Partial<T[]>>([]);
  const [opened, { open, close }] = useDisclosure(false);

  const handleCheckBoxSelect = (keys: Partial<T>, isChecked: boolean): void => {
    if (isChecked) {
      setCheckedKeys([...checkedKeys, keys as T]);
    } else {
      const tempData = checkedKeys.filter((key) => key !== keys);
      setCheckedKeys([...tempData]);
    }
  };
  const handleRadioSelect = (key: Partial<T>): void => {
    setCheckedKey(key);
    // console.log(key);
  };
  const handleClick = (node: Partial<T>): void => {
    const parents = getParents(data, node[fieldNames.key] as string);
    onClick?.(node, parents);
  };

  const handelOnDone = (): void => {
    onDone && onDone(multiSelect ? checkedKeys : checkedKey);
    close();
  };

  //get parents
  const getParents = (
    tree: any,
    key: string,
    parents: Partial<T[]> = [],
  ): Partial<T[]> | null => {
    for (const node of tree) {
      if (node[fieldNames.key] === key) {
        return [...parents, node];
      }
      if (node.children) {
        const found: Partial<T[]> | null = getParents(node.children, key, [
          ...(parents as T[]),
          node as T,
        ]);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const renderSelectTitle = (node: Partial<T>): ReactNode => {
    return multiSelect ? (
      <CheckBoxTreeNode
        checked={checkedKeys.includes(node as T)}
        fields={fieldNames}
        node={node}
        onSelect={handleCheckBoxSelect}
      />
    ) : (
      <RadioTreeNode
        fields={fieldNames}
        node={node}
        onSelect={handleRadioSelect}
        selectedKey={checkedKey}
      />
    );
  };
  const renderTitle = (node: Partial<T>): ReactNode => {
    return <TreeNode fields={fieldNames} node={node} onSelect={handleClick} />;
  };

  //hooks
  useEffect(() => {
    if (multiSelect) {
      selectedKeys && setCheckedKeys([...(selectedKeys as Partial<T[]>)]);
      !selectedKeys && setCheckedKeys([]);
    } else {
      selectedKeys && setCheckedKey({ ...(selectedKeys as Partial<T>) });
      !selectedKeys && setCheckedKey({});
    }
  }, [multiSelect, opened, selectedKeys]);
  return (
    <Box className=" text-ellipsis">
      {mode === 'view' && (
        <RcTree
          fieldNames={fieldNames}
          selectedKeys={clickedKeys}
          showIcon={false}
          showLine
          titleRender={(node) => renderTitle(node as Partial<T>)}
          treeData={data as DataNode[]}
        />
      )}

      {mode === 'select' && (
        <TextInput
          label={label}
          onClick={open}
          placeholder={placeholder}
          readOnly
          value={multiSelect ? '' : selectedKeys?.[fieldNames.title]}
        />
      )}
      <Modal onClose={close} opened={opened} title={label}>
        <RcTree
          fieldNames={fieldNames}
          showIcon={false}
          showLine
          titleRender={(node) => renderSelectTitle(node as Partial<T>)}
          treeData={data}
        />

        <Group className="mt-5">
          <Button className=" ml-auto" onClick={handelOnDone}>
            Done
          </Button>
          <Button onClick={close} variant="outline">
            Cancel
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
