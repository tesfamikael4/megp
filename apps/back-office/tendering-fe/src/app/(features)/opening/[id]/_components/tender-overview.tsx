'use client';
import { ActionIcon, Badge, Box, Flex, Text, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft, IconEye } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';

export const TenderOverView = () => {
  const { id, tenderId } = useParams();
  const router = useRouter();
  return (
    <Section
      title={
        <Flex
          justify="center"
          align="center"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          <IconChevronLeft size={14} />
          <Text className="font-semibold">
            Construction of Community Center
          </Text>
        </Flex>
      }
      subTitle="RFQ2024001"
      collapsible={false}
      action={
        <Tooltip label="Show opening minute">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => router.push(`/opening/minute/${id ?? tenderId}`)}
          >
            <IconEye size={14} />
          </ActionIcon>
        </Tooltip>
      }
    >
      <Flex gap={20}>
        <Box className="w-full">
          <Flex gap={5}>
            <Box>
              <Text fw={500} size="sm">
                Envelope :
              </Text>
              <Text fw={500} size="sm">
                Bid :
              </Text>
            </Box>
            <Box>
              <Badge variant="outline" size="xs" color="gray">
                Single Envelope
              </Badge>
              <Text>
                <Badge variant="outline" size="xs" color="gray">
                  Item Based
                </Badge>
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box className="w-full">
          <Flex gap={5}>
            <Box>
              <Text fw={500} size="sm">
                Evaluation method :
              </Text>
              <Text fw={500} size="sm">
                Milestone :
              </Text>
            </Box>
            <Box>
              <Text size="sm">Compliance Based</Text>
              <Text size="sm">Financial Opening - In Progress</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Section>
  );
};
