'use client';
import { useEffect, useState } from 'react';
import {
  useLazyGetFilesQuery,
  useLazyDownloadFilesQuery,
} from '../_api/catalog.api';
import { Box, Flex, Image, Text } from '@mantine/core';
import { useParams } from 'next/navigation';
import { UploadImage } from './image-upload';
import {
  IconUpload,
  IconChevronRight,
  IconChevronLeft,
} from '@tabler/icons-react';

export default function ViewImage() {
  const [getImage, { data, isLoading }] = useLazyGetFilesQuery();
  const [index, setIndex] = useState(0);
  const { id } = useParams();

  const [dowloadPrFile, { data: url, isLoading: isPrLoading }] =
    useLazyDownloadFilesQuery();

  useEffect(() => {
    getImage(id?.toString());
  }, [getImage, id]);

  const handleNext = () => {
    if (index < (data?.items?.length ?? 0) - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setIndex(0);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    } else {
      setIndex((data?.items?.length ?? 0) - 1);
    }
  };

  useEffect(() => {
    dowloadPrFile(data?.items?.[index]?.id);
  }, [index, data]);

  return (
    <>
      <Box className="w-full ">
        <Flex h={250} justify={'center'} align={'center'}>
          {!url && (
            <Flex align="center" direction={'column'}>
              <IconUpload size={30} color="#1D8E3F" />
              <Text>Upload Image</Text>
            </Flex>
          )}
          {url && (
            <Box className=" relative">
              <Image
                src={url?.presignedUrl}
                unstyled
                alt="Product image"
                className=" object-cover"
              />
            </Box>
          )}
        </Flex>
        <Flex justify="space-between" mb="sm">
          <Box>
            {index !== 0 && (
              <IconChevronLeft
                stroke={2}
                color="white"
                size={30}
                onClick={handlePrev}
                className="cursor-pointer  rounded-full bg-op bg-opacity-40 bg-black "
              />
            )}
          </Box>
          {index < data?.items?.length - 1 && (
            <IconChevronRight
              stroke={2}
              color="white"
              size={30}
              onClick={handleNext}
              className="cursor-pointer  rounded-full bg-op bg-opacity-40 bg-black "
            />
          )}
        </Flex>
      </Box>

      <UploadImage />
    </>
  );
}
