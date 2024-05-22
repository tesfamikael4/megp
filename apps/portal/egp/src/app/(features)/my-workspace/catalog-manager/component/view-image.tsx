'use client';
import { useEffect } from 'react';
import {
  useLazyGetFilesQuery,
  useLazyDownloadFilesQuery,
} from '../_api/catalog.api';
import { Box, Flex, Image, Text } from '@mantine/core';
import { useParams } from 'next/navigation';
import { UploadImage } from './image-upload';
import { IconUpload } from '@tabler/icons-react';

export default function ViewImage() {
  const [getImage, { data, isLoading }] = useLazyGetFilesQuery();
  const { id } = useParams();

  const [dowloadPrFile, { data: url, isLoading: isPrLoading }] =
    useLazyDownloadFilesQuery();

  useEffect(() => {
    getImage(id?.toString());
  }, [getImage, id]);

  useEffect(() => {
    dowloadPrFile(data?.items?.[0]?.id);
  }, [data]);

  return (
    <>
      <Box className="w-full">
        <Flex h={350} justify={'center'} align={'center'}>
          {!url && (
            <Flex align="center" direction={'column'}>
              <IconUpload size={30} color="#1D8E3F" />
              <Text>Upload Image</Text>
            </Flex>
          )}
          {url && <Image src={url?.presignedUrl} alt="Product image" />}
        </Flex>
      </Box>

      <UploadImage />
    </>
  );
}
