'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/(app)/_components/activity-form-detail';
import { Box, Flex, Text, Tooltip } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function NewActivity() {
  const router = useRouter();
  return (
    <>
      <Box className="bg-white">
        <Flex justify="space-between" className="p-2">
          <Tooltip
            label="List Activities"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <Flex align="center">
              <IconChevronLeft size={14} />
              <Text className="font-semibold text-lg">New</Text>
            </Flex>
          </Tooltip>
        </Flex>
        {/* <Divider /> */}
        <Flex gap={10} className="mt-2 ml-2">
          <Box className="bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-gray-700 font-medium">
            Activity Identification
          </Box>
        </Flex>
      </Box>
      <Box className="mt-5">
        <FormDetail mode="new" page="pre" />
      </Box>
    </>
  );
}
