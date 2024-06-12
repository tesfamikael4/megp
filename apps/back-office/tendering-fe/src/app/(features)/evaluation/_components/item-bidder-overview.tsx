'use client';
import { useCompleteResponsivenessEvaluationMutation } from '@/store/api/tendering/technical-responsiveness.api';
import { useLazyGetItemBidderDetailsQuery } from '@/store/api/tendering/tendering.api';
import { Badge, Box, Button, Flex, LoadingOverlay, Text } from '@mantine/core';
import { Section, notify } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ItemBidderOverView = ({
  basePath,
  teamAssessment = false,
}: {
  basePath: string;
  teamAssessment?: boolean;
}) => {
  const { tenderId, lotId, bidderId, itemId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [getBidder, { data, isLoading }] = useLazyGetItemBidderDetailsQuery();
  const [
    completeResponsivenessEvaluation,
    { isLoading: isResponsivenessCompleting },
  ] = useCompleteResponsivenessEvaluationMutation();

  useEffect(() => {
    getBidder({
      tenderId,
      lotId,
      itemId,
      bidderId,
    });
  }, [tenderId]);

  const complete = async () => {
    try {
      await completeResponsivenessEvaluation({
        lotId: lotId as string,
        bidderId: bidderId as string,
        itemId: itemId as string,
        isTeamLead: pathname.includes('team-assessment'),
      }).unwrap();

      notify('Success', 'completed successfully');
      router.push(basePath);
    } catch {
      notify('Error', 'Something went wrong');
    }
  };
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
              Item :
              <Text span className="font-normal text-lg">
                {data?.bidRegistrations?.[0]?.bidderName ?? ''}
              </Text>
            </Text>
            {teamAssessment && (
              <Badge className="ml-5" size="xs">
                Team Assessment
              </Badge>
            )}
          </Flex>
        }
        subTitle={'Bidder : ' + data?.bidRegistrations?.[0]?.bidderName ?? ''}
        collapsible={false}
        action={
          <Button onClick={complete} loading={isResponsivenessCompleting}>
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
                  Award Type :
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
