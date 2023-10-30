'use client';

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, TextInput, Flex } from '@mantine/core';
import { useEffect, useState } from 'react';
import { TreeBuilder } from './tree-builder';

interface TreeProps {
  items?: any[];
  mode: 'select' | 'view';
  accessorKeys: { label: string; children: string };
  isSelectable?: boolean;
  lazyGet?: boolean;
  selectedItem?: any;
  label?: string;
  placeholder?: string;
  disableParentSelect?: boolean;
  multiSelect?: boolean;
  onDone: (item) => void;
  error?: string | null;
  withAsterisk?: boolean;
}

export const Tree = ({
  items,
  mode,
  accessorKeys,
  onDone,
  label,
  error,
  selectedItem,
  placeholder = '',
  multiSelect = false,
  disableParentSelect = false,
  withAsterisk = false,
  lazyGet = false,
  isSelectable = true,
}: TreeProps) => {
  //states
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedData, setSelectedData] = useState<any>(multiSelect ? [] : {});

  //event handlers
  const handelDone = () => {
    onDone(selectedData);
    close();
  };

  const handelSelectItem = (data: any, isChecked: boolean) => {
    if (isChecked) {
      const tempData = [...selectedData, data];
      setSelectedData(tempData);
    } else {
      const tempData = selectedData.filter((d) => d.id != data.id);
      setSelectedData(tempData);
    }
  };

  // hooks
  useEffect(() => {
    if (selectedItem) {
      multiSelect && setSelectedData([...selectedItem]);
      !multiSelect && setSelectedData({ ...selectedItem });
    } else {
      multiSelect && setSelectedData([]);
      !multiSelect && setSelectedData({});
    }
  }, [multiSelect, opened, selectedItem]);

  return (
    <>
      {mode == 'select' && (
        <>
          <Modal opened={opened} onClose={close} title={label}>
            {items?.map((node) => (
              <TreeBuilder
                accessorKeys={accessorKeys}
                mode={mode}
                data={node}
                key={node.id}
                selectedData={selectedData}
                disableParentSelect={disableParentSelect}
                handelSelectItem={handelSelectItem}
                multiSelect={multiSelect}
                setSelectedData={setSelectedData}
              />
            ))}
            <Group mt={2} justify="flex-end">
              <Button onClick={handelDone}>Done</Button>
              <Button onClick={close} variant="outline">
                Cancel
              </Button>
            </Group>
          </Modal>
          <Flex gap="md" align="end">
            <TextInput
              label={label}
              placeholder={placeholder}
              className="w-full"
              readOnly
              value={multiSelect ? 'test' : selectedItem?.label}
              onClick={open}
              error={error}
              withAsterisk={withAsterisk}
            />
            {/* <Button onClick={open}>Select</Button> */}
          </Flex>
        </>
      )}
      {mode == 'view' && (
        <>
          {items?.map((node) => (
            <TreeBuilder
              accessorKeys={accessorKeys}
              mode={mode}
              data={node}
              key={node.id}
              selectedData={selectedData}
              disableParentSelect={disableParentSelect}
              handelSelectItem={handelSelectItem}
              multiSelect={multiSelect}
              setSelectedData={setSelectedData}
            />
          ))}
        </>
      )}
    </>
  );
};
