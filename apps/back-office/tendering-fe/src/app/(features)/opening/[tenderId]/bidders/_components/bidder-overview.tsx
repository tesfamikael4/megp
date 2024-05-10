'use client';

import { Badge, Box, Flex, Text, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export const BidderOverView = ({ basePath }: { basePath: string }) => {
  const router = useRouter();
  return (
    <Section
      title={
        <Tooltip
          label="List of bidders"
          className="cursor-pointer"
          onClick={() => router.push(basePath)}
        >
          <Flex justify="center" align="center">
            <IconChevronLeft size={14} />
            <Text className="font-semibold">
              Construction of Community Center
            </Text>
          </Flex>
        </Tooltip>
      }
      subTitle="RFQ2024001"
      collapsible={false}
    >
      <Flex gap={20}>
        <Box className="w-full">
          <Flex gap={5}>
            <Box>
              <Text fw={500} size="sm">
                Bidder :
              </Text>
              <Text fw={500} size="sm">
                Envelope :
              </Text>
              <Text fw={500} size="sm">
                Bid :
              </Text>
            </Box>

            <Box ml={10}>
              <Text>Perago Information Systems</Text>
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
