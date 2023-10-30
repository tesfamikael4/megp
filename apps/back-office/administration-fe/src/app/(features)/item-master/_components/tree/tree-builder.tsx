import { ActionIcon, Box, Center, Checkbox, Radio, Text } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

interface TreeBuilderProps {
  data: any;
  accessorKeys: { label: string; children: string };
  mode: 'select' | 'view';
  selectedData?: any;
  multiSelect?: boolean;
  disableParentSelect?: boolean;
  handelSelectItem?: (data, isChecked) => void;
  setSelectedData?: (data) => void;
}

export const TreeBuilder = ({
  data,
  accessorKeys,
  mode,
  selectedData,
  multiSelect,
  disableParentSelect,
  handelSelectItem,
  setSelectedData,
}: TreeBuilderProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const toggleExpandeble = () => {
    setIsOpened(!isOpened);
  };
  return (
    <Box className="ml-5">
      <Box className="flex">
        {/* {data.children?.length !== 0 && ( */}
        <Center>
          <ActionIcon
            className="mr-2"
            color="primary"
            onClick={toggleExpandeble}
            size={15}
            variant="outline"
          >
            {isOpened ? (
              <IconMinus size={10} stroke={1} />
            ) : (
              <IconPlus size={10} stroke={1} />
            )}
          </ActionIcon>
        </Center>
        {/* )} */}
        {mode == 'select' && (
          <Center>
            {multiSelect ? (
              disableParentSelect ? (
                data[accessorKeys.children]?.length == 0 && (
                  <Checkbox
                    size="15"
                    checked={selectedData?.includes(data)}
                    onChange={(e) => {
                      handelSelectItem != undefined &&
                        handelSelectItem(data, e.target.checked);
                    }}
                    className={
                      // data.children?.length !== 0 ? 'mr-2' : 'mr-2 ml-6'
                      'mr-2'
                    }
                  />
                )
              ) : (
                <Checkbox
                  size="15"
                  checked={selectedData?.includes(data)}
                  onChange={(e) => {
                    handelSelectItem != undefined &&
                      handelSelectItem(data, e.target.checked);
                  }}
                  className={
                    // data.children?.length !== 0 ? 'mr-2' : 'mr-2 ml-6'
                    'mr-2'
                  }
                />
              )
            ) : disableParentSelect ? (
              data[accessorKeys.children]?.length == 0 && (
                <Radio
                  size="xs"
                  checked={selectedData?.id == data.id}
                  onChange={() => {
                    setSelectedData != undefined && setSelectedData(data);
                  }}
                  className={
                    // data.children?.length !== 0 ? 'mr-2' : 'mr-2 ml-6'
                    'mr-2'
                  }
                />
              )
            ) : (
              <Radio
                size="xs"
                checked={selectedData?.id == data.id}
                onChange={() => {
                  setSelectedData != undefined && setSelectedData(data);
                }}
                className={
                  // data.children?.length !== 0 ? 'mr-2' : 'mr-2 ml-6'
                  'mr-2'
                }
              />
            )}
          </Center>
        )}
        <Text>{data[accessorKeys.label]}</Text>
      </Box>
      {isOpened && (
        <>
          {data[accessorKeys.children].map((node) => (
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
    </Box>
  );
};
