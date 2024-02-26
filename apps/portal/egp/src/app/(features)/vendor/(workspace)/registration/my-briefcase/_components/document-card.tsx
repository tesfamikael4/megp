import { Paper, Flex, ActionIcon, Button, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconFileText,
  IconTrash,
  IconRotate,
  IconEye,
} from '@tabler/icons-react';
import { useState } from 'react';
import { DisplayFileModal } from './display-file-modal';

const DocumentCard = ({
  data,
  canDelete,
}: {
  data: {
    label: string;
    value: string;
    key: string;
  };
  canDelete: boolean;
}) => {
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleViewFile = (data: string) => {
    setCertificateUrl(data);
    open();
  };
  const handleCloseFile = () => {
    setCertificateUrl(null);
    close();
  };
  return (
    <>
      <Paper shadow="xs" className="p-2 relative bg-[#E7F4F7] ">
        <>
          <Flex direction={'column'}>
            <Flex align={'center'} justify={'space-between'} w="100%">
              <Flex align={'center'}>
                <IconFileText size={16} className="mr-2" stroke={1} />
                <Text fw={600} fz={'sm'} w={250} truncate>
                  {data.label}
                </Text>
              </Flex>
              <ActionIcon variant="transparent">
                <IconTrash size={16} />
              </ActionIcon>
            </Flex>
            <Text pl={24} fz={'xs'} c={'dimmed'}>
              200kb
            </Text>
            <Button
              w={'fit-content'}
              styles={{
                root: {
                  padding: '0px',
                },
              }}
              // leftSection={<IconEye size={16} />}
              className="items-center"
              onClick={() =>
                handleViewFile(
                  `${
                    process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api'
                  }/upload/get-file/SupportingDocument/${data.value}`,
                )
              }
              variant="transparent"
            >
              <Text pl={24} size={'xs'} c={'#1D8E3F'} fw={600}>
                Click to view
              </Text>
            </Button>
          </Flex>
        </>
        {canDelete && (
          <Menu width={200} shadow="md">
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconRotate size={16} />}>
                Update
              </Menu.Item>
              <Menu.Item
                leftSection={<IconEye size={16} />}
                onClick={() =>
                  handleViewFile(
                    `${
                      process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api'
                    }/upload/get-file/SupportingDocument/${data.value}`,
                  )
                }
              >
                View
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Paper>
      {certificateUrl && (
        <DisplayFileModal
          onClose={handleCloseFile}
          opened={opened}
          fileName={certificateUrl}
        />
      )}
    </>
  );
};

export default DocumentCard;
