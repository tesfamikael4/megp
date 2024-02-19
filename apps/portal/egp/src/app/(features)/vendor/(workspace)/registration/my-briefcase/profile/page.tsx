'use client';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Menu,
  Paper,
  Text,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEye,
  IconFile,
  IconRotate,
  IconUserCircle,
} from '@tabler/icons-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useGetVendorQuery } from '../../_api/query';
import { FileIcon } from '../_components/file-icon/icon';
import { addSpacesToCamelCase } from '../../new/_components/review/utils';
import { DisplayFileModal } from '../_components/display-file-modal/modal';
import { useDisclosure } from '@mantine/hooks';

function Page() {
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const fileNames: { [key: string]: string } = {
    businessRegistration_IncorporationCertificate:
      'Business Registration Incorporation Certificate',
    mRA_TPINCertificate: 'MRA TPIN Certificate',
    mRATaxClearanceCertificate: 'MRA Tax Clearance Certificate',
  };
  const handleViewFile = (data: string) => {
    setCertificateUrl(data);
    open();
  };
  const handleCloseFile = () => {
    setCertificateUrl(null);
    close();
  };
  return (
    <Box className="p-4 bg-slate-100">
      {certificateUrl && (
        <DisplayFileModal
          onClose={handleCloseFile}
          opened={opened}
          fileName={certificateUrl}
        />
      )}

      <Box className=" w-full p-6 min-h-screen bg-white">
        <Flex className="flex flex-col gap-2  w-full border-b ">
          <Link
            href={'/vendor/registration/my-briefcase'}
            className="flex items-center gap-2"
          >
            <IconArrowLeft size={22} stroke={1.8} /> <Text fz={12}>Back</Text>
          </Link>
          <Flex className="w-full py-2 gap-1 items-center">
            <Text fw={700} fz="md" color="gray.5">
              Profile Data
            </Text>
          </Flex>
        </Flex>
        <Box className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {requestInfo.data &&
            requestInfo.data.supportingDocuments &&
            Object.entries(fileNames)
              .map(([key, value]) => ({
                label: fileNames[key], // replace underscores with spaces for labels
                value: requestInfo?.data?.supportingDocuments[key],
                key,
              }))
              .map((data, index) => (
                <Paper
                  key={index}
                  shadow="xs"
                  className="col-span-1 flex p-2 relative"
                >
                  <Center className={'flex  items-center justify-center'}>
                    <FileIcon />
                  </Center>
                  <div className="flex  justify-between truncate rounded-r-md border-">
                    <Flex className=" flex-col">
                      <Text fw={600} fz={'sm'} w={150} truncate>
                        {data.label}
                      </Text>
                      <Text fw={500} fz={'xs'} w={150} truncate>
                        File size:
                      </Text>
                    </Flex>
                  </div>
                  <Menu width={200} shadow="md">
                    <Menu.Target>
                      <ActionIcon variant="transparent">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      {/* <Menu.Item leftSection={<IconRotate size={16} />}>
                        Update
                      </Menu.Item> */}
                      <Menu.Item
                        leftSection={<IconEye size={16} />}
                        onClick={() =>
                          handleViewFile(
                            `${
                              process.env.NEXT_PUBLIC_VENDOR_API ??
                              '/vendors/api'
                            }/upload/get-file/SupportingDocument/${data.value}`,
                          )
                        }
                      >
                        View
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Paper>
              ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Page;
