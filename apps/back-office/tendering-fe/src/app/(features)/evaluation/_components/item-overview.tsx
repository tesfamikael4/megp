'use client';
import { useLazyGetItemDetailsQuery } from '@/store/api/tendering/tendering.api';
import { Badge, Box, Flex, LoadingOverlay, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ItemsOverview = ({ basePath }: { basePath: string }) => {
  const { tenderId, lotId, itemId } = useParams();
  const router = useRouter();
  const [getItem, { data, isLoading }] = useLazyGetItemDetailsQuery();

  useEffect(() => {
    getItem({ tenderId, lotId, itemId });
  }, [tenderId]);
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Section
        title={
          <Flex justify="center" align="center" className="cursor-pointer">
            <IconChevronLeft size={14} onClick={() => router.push(basePath)} />
            <Text
              className="font-semibold text-lg"
              onClick={() => router.push(basePath)}
            >
              Item :{' '}
              <Text span className="font-normal text-lg">
                {data?.lots?.[0]?.items?.[0]?.name ?? ''}
              </Text>
            </Text>
          </Flex>
        }
        collapsible={false}
      >
        <Flex gap={20}>
          <Box className="w-full">
            <Flex gap={5}>
              <Box>
                <Text fw={500} size="sm">
                  Tender :
                </Text>
                <Text fw={500} size="sm">
                  Envelope :
                </Text>
                <Text fw={500} size="sm">
                  Bid :
                </Text>
              </Box>
              <Box>
                <p>{data?.name ?? ''}</p>
                {data?.bdsSubmission?.envelopType && (
                  <Badge variant="outline" size="xs" color="gray">
                    {data?.bdsSubmission?.envelopType}
                  </Badge>
                )}
                <Text>
                  {data?.bdsEvaluation?.awardType && (
                    <Badge variant="outline" size="xs" color="gray">
                      {data?.bdsEvaluation?.awardType}
                    </Badge>
                  )}
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box className="w-full">
            <Flex gap={5}>
              <Box>
                <Text fw={500} size="sm">
                  Lot :
                </Text>
                <Text fw={500} size="sm">
                  Evaluation method :
                </Text>
                <Text fw={500} size="sm">
                  Milestone :
                </Text>
              </Box>
              <Box>
                <p>{data?.lots?.[0]?.name ?? ''}</p>
                <Text size="sm">
                  {data?.bdsEvaluation?.evaluationMethod && (
                    <Badge variant="outline" size="xs" color="gray">
                      {data?.bdsEvaluation?.evaluationMethod}
                    </Badge>
                  )}
                </Text>
                <Text size="sm">
                  {data?.status && (
                    <Badge variant="outline" size="xs" color="gray">
                      {data?.lots?.[0]?.tenderMilestones?.[0]?.milestoneTxt?.replace(
                        /([a-z])([A-Z])/g,
                        '$1 $2',
                      )}
                    </Badge>
                  )}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Section>
    </Box>
  );
};
