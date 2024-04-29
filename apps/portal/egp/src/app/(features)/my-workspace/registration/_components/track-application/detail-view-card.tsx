'use client';

import React, { useCallback, useEffect, useState } from 'react';
import styles from './detail-view-card.module.scss';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Paper,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { ApplicationInfo } from '@/models/vendorRegistration';
import { getCookie } from 'cookies-next';
import { PDFHighlighter } from '../../../_components/pdf-highlighter/pdf-highlighter';
import { logger } from '@megp/core-fe';
const BASE_URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

const callbackURL = (key: string) => {
  if (key == 'NewRegistration') {
    return 'new/detail';
  }
  if (key == 'ProfileUpdate') {
    return 'profile-update';
  }
  if (key == 'Medium' || key == 'Small' || key == ' MIrc') {
    return 'preferential-treatment';
  }
  if (key == 'ibm') {
    return 'preferential-treatment';
  }
  if (key == 'Marginalized_Group') {
    return 'preferential-treatment';
  }
};

const downloadFile = async (url: string, filename) => {
  const token = getCookie('token');
  await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Replace 'fileName' with the desired name of the downloaded file
      document.body.appendChild(link);
      link.click();
      (link.parentNode as any).removeChild(link);
    })
    .catch((error) => console.error(error));
};

interface Props {
  data: ApplicationInfo;
  close: () => void;
}
const badgeBGColor: { [key: string]: string } = {
  Rejected: `red.0`,
  Submitted: `blue.0`,
  Adjustment: `yellow.0`,
  Completed: `green.0`,
  Pending: `blue.0`,
  Outdated: `orange.0`,
};
const badgeTextColor: { [key: string]: string } = {
  Rejected: `red.6`,
  Submitted: `blue.6`,
  Adjustment: `yellow.6`,
  Completed: `green.6`,
  Pending: `blue.6`,
  Outdated: `orange.6`,
};
const DetailViewCard: React.FC<Props> = ({ data, close }) => {
  const router = useRouter();

  const [fileUrl, setFileUrl] = useState('');
  useEffect(() => {
    const getFile = async (url) => {
      const newURl = `${
        process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'
      }upload/get-file-bo/application-doc/${url}/${data?.data?.data?.userId}`;

      try {
        const token = getCookie('token');
        const response = await fetch(newURl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching file');
        }
        const fileBlob = await response.blob();
        // const blobType = fileBlob.type;

        setFileUrl(URL.createObjectURL(fileBlob));
      } catch (error) {
        logger.log(error);
      }
    };
    void getFile(data?.data?.data?.documentId);
  }, [data?.data?.data?.documentId, data?.data?.data?.userId]);

  return (
    <Paper shadow="xs" withBorder className={styles.card}>
      <Box className={styles.cardHeader}>
        <Flex gap={'xs'}>
          <Text className="text-md font-semibold text-green-500">
            Adjustment Required
          </Text>
          <Text fz={'sm'}>{data.applicationNumber}</Text>
        </Flex>
      </Box>
      <Box className={styles.cardBody}>
        Remark: {data.remark}
        <Box className="w-full mt-2">
          <PDFHighlighter
            title={data?.data?.data?.documentId as string}
            objectId={data?.data?.data?.userId as string}
            pdfUrl={fileUrl}
          />
        </Box>
      </Box>

      <Box className={styles.cardFooter}>
        {data.status === 'Adjustment' && (
          <Flex align={'center'} columnGap={'md'}>
            <Button
              onClick={() => {
                window.open(
                  `/my-workspace/registration/${callbackURL(data.key)}`,
                  '_blank',
                );
              }}
            >
              Adjust
            </Button>
          </Flex>
        )}
      </Box>
    </Paper>
  );
};
export default DetailViewCard;
