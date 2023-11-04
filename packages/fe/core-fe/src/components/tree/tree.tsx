'use client';

import { Box, Button, Group, Modal, TextInput } from '@mantine/core';
import RcTree from 'rc-tree';
import { useDisclosure } from '@mantine/hooks';
import 'rc-tree/assets/index.css';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import type { DataNode } from 'rc-tree/lib/interface';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { CheckBoxTreeNode, RadioTreeNode, TreeNode } from './tree-nodes';

interface TreeProps<T> {
  data: T[];
  mode: 'view' | 'select';
  multiSelect?: boolean;
  required?: boolean;
  lazyLoad?: boolean;
  url?: string;
  disableModal?: boolean;
  disableParentSelect?: boolean;
  fieldNames: { title: string; key: string; children?: string };
  clickedKeys?: string[];
  selectedKeys?: Partial<T> | Partial<T[]>;
  onClick?: (node: Partial<T>, parents?: Partial<T[]> | null) => void;
  onDone?: (selectedKey: Partial<T> | Partial<T[]>) => void;
  label?: string;
  placeholder?: string;
  error?: string | null;
}

export function Tree<T>({
  mode,
  data,
  onClick,
  onDone,
  error,
  selectedKeys,
  fieldNames,
  clickedKeys = [],
  label = '',
  placeholder = '',
  multiSelect = false,
  disableModal = false,
  required = false,
  url = '',
  disableParentSelect = false,
}: TreeProps<T>): ReactNode {
  const [checkedKey, setCheckedKey] = useState<Partial<T>>({});
  const [checkedKeys, setCheckedKeys] = useState<Partial<T[]>>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [treeData, setTreeData] = useState<Partial<T[]>>([]);

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

  //lazy load
  const handleLoadData = (treeNode: any) =>
    new Promise<void>((resolve) => {
      if (!treeNode.children) {
        fetch(`${url}/${treeNode[fieldNames.key]}`)
          .then((response) => response.json())
          .then((res) => {
            const children = [res.items];
            treeNode.children = children;
            setTreeData([...treeData]);
            resolve();
          })
          .catch(() => {
            // console.error('Error fetching data: ', error);
            resolve();
          });
      } else {
        resolve();
      }
    });

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
        disableParentSelect={disableParentSelect}
        fields={fieldNames}
        node={node}
        onSelect={handleCheckBoxSelect}
      />
    ) : (
      <RadioTreeNode
        disableParentSelect={disableParentSelect}
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
          loadData={handleLoadData}
          selectedKeys={clickedKeys}
          showIcon={false}
          showLine
          titleRender={(node) => renderTitle(node as unknown as Partial<T>)}
          treeData={data as DataNode[]}
        />
      )}

      {mode === 'select' && !disableModal && (
        <TextInput
          error={error}
          label={label}
          onClick={open}
          placeholder={placeholder}
          readOnly
          value={multiSelect ? '' : selectedKeys?.[fieldNames.title]}
          withAsterisk={required}
        />
      )}

      {mode === 'select' && disableModal ? (
        <>
          <RcTree
            fieldNames={fieldNames}
            loadData={handleLoadData}
            showIcon={false}
            showLine
            titleRender={(node) =>
              renderSelectTitle(node as unknown as Partial<T>)
            }
            treeData={data as DataNode[]}
          />

          <Group className="mt-4">
            <Button onClick={handelOnDone}>
              <IconDeviceFloppy className="mr-2" size={13} /> Save
            </Button>
          </Group>
        </>
      ) : null}

      <Modal onClose={close} opened={opened} title={label}>
        <RcTree
          fieldNames={fieldNames}
          loadData={handleLoadData}
          showIcon={false}
          showLine
          titleRender={(node) =>
            renderSelectTitle(node as unknown as Partial<T>)
          }
          treeData={data as DataNode[]}
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
