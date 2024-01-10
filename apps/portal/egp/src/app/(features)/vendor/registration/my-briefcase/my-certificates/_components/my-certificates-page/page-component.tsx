'use client';
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Modal,
  Paper,
  Text,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendar,
  IconCertificate,
  IconDownload,
  IconEye,
  IconFile,
  IconUserCircle,
} from '@tabler/icons-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { DisplayFileModal } from '../../../_components/display-file-modal/modal';
import { useGetCertificateInformationQuery } from '../../../../_api/query';
import dayjs from 'dayjs';
import { DownloadFile } from '@/app/(features)/vendor/_components/display-file/download-file';
function PageComponent() {
  const [opened, { open, close }] = useDisclosure(false);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const handleViewFile = (data: string) => {
    setCertificateUrl(data);
    open();
  };
  const handleCloseFile = () => {
    setCertificateUrl(null);
    close();
  };
  const getCertificateInformation = useGetCertificateInformationQuery();
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
              Certificates
            </Text>
          </Flex>
        </Flex>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
          {getCertificateInformation.data &&
            getCertificateInformation.data.length > 0 &&
            getCertificateInformation.data.map((data, index) =>
              data.certificateUrl &&
              (data.category === 'goods' || data.category === 'services') ? (
                <Paper
                  key={index}
                  withBorder
                  className="col-span-1 flex flex-col divide-y text-center"
                >
                  <div className="flex flex-1 flex-col p-4 gap-4 mx-auto">
                    <Center className="mx-auto p-4 flex-shrink-0 rounded-full  bg-slate-100">
                      <IconCertificate size={35} stroke={1.4} />
                    </Center>
                    <Text
                      fz={'md'}
                      fw={700}
                      w={180}
                      className="mt-4 break-words"
                    >
                      Registration for{' '}
                      {data.category.charAt(0).toUpperCase() +
                        data.category.slice(1)}{' '}
                      Certificate
                    </Text>
                    <Flex gap={5}>
                      <Text fz={'xs'} fw={800} color="gray.5">
                        Valid until:
                      </Text>
                      <IconCalendar size={14} />
                      <Text fz={'xs'}>
                        {dayjs(data.approvedAt).format('DD MMM YYYY')}
                      </Text>
                    </Flex>
                  </div>
                  <div>
                    <Flex className="divide-x">
                      <div className="flex w-0 flex-1 p-1 hover:bg-slate-100">
                        <DownloadFile
                          url={`${
                            process.env.NEXT_PUBLIC_VENDOR_API ??
                            '/vendors/api/'
                          }/upload/get-certificate/${data.certificateUrl}`}
                          filename={data.certificateUrl}
                        />
                      </div>
                      <div className=" flex w-0 flex-1 p-1 hover:bg-slate-100">
                        <Button
                          variant="transparent"
                          className="w-full rounded"
                          onClick={() =>
                            handleViewFile(
                              `${
                                process.env.NEXT_PUBLIC_VENDOR_API ??
                                '/vendors/api/'
                              }/upload/get-certificate/${data.certificateUrl}`,
                            )
                          }
                          leftSection={<IconEye size={13} />}
                        >
                          View
                        </Button>
                      </div>
                    </Flex>
                  </div>
                </Paper>
              ) : (
                <></>
              ),
            )}
        </div>
      </Box>
    </Box>
  );
}

export default PageComponent;
