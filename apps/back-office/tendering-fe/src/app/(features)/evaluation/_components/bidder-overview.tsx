'use client';
import { useCompleteEvaluationMutation } from '@/store/api/tendering/preliminary-compliance.api';
import { useCompleteQualificationEvaluationMutation } from '@/store/api/tendering/technical-qualification';
import { useCompleteResponsivenessEvaluationMutation } from '@/store/api/tendering/technical-responsiveness.api';
import { useCompleteScoringEvaluationMutation } from '@/store/api/tendering/technical-scoring.api';
import { useLazyGetBidderDetailsQuery } from '@/store/api/tendering/tendering.api';
import { Badge, Box, Button, Flex, LoadingOverlay, Text } from '@mantine/core';
import { Section, notify } from '@megp/core-fe';
import { IconChevronLeft } from '@tabler/icons-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const BidderOverView = ({
  basePath,
  milestone,
  teamAssessment = false,
}: {
  basePath: string;
  teamAssessment?: boolean;
  milestone:
    | 'technicalCompliance'
    | 'technicalQualification'
    | 'technicalResponsiveness'
    | 'technicalScoring';
}) => {
  const { tenderId, lotId, bidderId, itemId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [getBidder, { data, isLoading }] = useLazyGetBidderDetailsQuery();
  const [completeEvaluation, { isLoading: isCompleting }] =
    useCompleteEvaluationMutation();
  const [
    completeQualificationEvaluation,
    { isLoading: isQualificationCompleting },
  ] = useCompleteQualificationEvaluationMutation();
  const [
    completeResponsivenessEvaluation,
    { isLoading: isResponsivenessCompleting },
  ] = useCompleteResponsivenessEvaluationMutation();
  const [completeScoringEvaluation, { isLoading: isScoringCompleting }] =
    useCompleteScoringEvaluationMutation();

  useEffect(() => {
    getBidder({
      tenderId: tenderId as string,
      lotId: lotId as string,
      bidderId: bidderId as string,
    });
  }, [tenderId]);

  const complete = async () => {
    try {
      if (milestone === 'technicalCompliance') {
        await completeEvaluation({
          lotId: lotId as string,
          bidderId: bidderId as string,
          isTeamLead: pathname.includes('team-assessment'),
        }).unwrap();
      } else if (milestone === 'technicalQualification') {
        await completeQualificationEvaluation({
          lotId: lotId as string,
          bidderId: bidderId as string,
          isTeamLead: pathname.includes('team-assessment'),
        }).unwrap();
      } else if (milestone == 'technicalResponsiveness') {
        await completeResponsivenessEvaluation({
          lotId: lotId as string,
          bidderId: bidderId as string,
          itemId: itemId as string,
          isTeamLead: pathname.includes('team-assessment'),
        }).unwrap();
      } else if (milestone == 'technicalScoring') {
        await completeScoringEvaluation({
          lotId: lotId as string,
          bidderId: bidderId as string,
        }).unwrap();
      }
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
              Bidder :
              <Text span className="font-normal text-lg">
                {' ' + data?.bidRegistrations?.[0]?.bidderName ?? ''}
              </Text>
            </Text>
            {teamAssessment && (
              <Badge className="ml-5" size="xs">
                Team Assessment
              </Badge>
            )}
          </Flex>
        }
        // subTitle={data?.procurementReferenceNumber ?? ''}
        collapsible={false}
        action={
          <Button
            onClick={complete}
            loading={
              isCompleting ||
              isQualificationCompleting ||
              isResponsivenessCompleting ||
              isScoringCompleting
            }
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
