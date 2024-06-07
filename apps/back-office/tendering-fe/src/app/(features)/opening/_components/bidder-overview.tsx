'use client';
import {
  useLazyGetBidderDetailsQuery,
  useLazyGetLotDetailQuery,
} from '@/store/api/tendering/tendering.api';
import { Badge, Box, Button, Flex, LoadingOverlay, Text } from '@mantine/core';
import { Section, notify } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const BidderOverView = ({ basePath }: { basePath: string }) => {
  const { tenderId, lotId, bidderId } = useParams();
  const router = useRouter();
  const [getBidder, { data, isLoading }] = useLazyGetBidderDetailsQuery();

  useEffect(() => {
    getBidder({
      tenderId: tenderId as string,
      lotId: lotId as string,
      bidderId: bidderId as string,
    });
  }, [tenderId]);
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Section
        title={
          <Flex
            justify="center"
            align="center"
            onClick={() => router.push(basePath)}
            className="cursor-pointer"
          >
            <IconChevronLeft size={14} />
            <Text className="font-semibold text-lg">
              Bidder :
              <Text span className="font-normal text-lg">
                {data?.bidRegistrations?.[0]?.bidderName ?? ''}
              </Text>
            </Text>
          </Flex>
        }
        collapsible={false}
        action={
          <Button
            onClick={() => {
              notify('Success', 'completed successfully');
              router.push(basePath);
            }}
          >
            Complete
          </Button>
        }
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
                {data?.lots?.[0]?.name && <p>{data?.lots?.[0]?.name}</p>}
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
