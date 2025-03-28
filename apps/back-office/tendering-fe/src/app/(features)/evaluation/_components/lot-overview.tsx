'use client';
import { useSubmitBidPriceEvaluationMutation } from '@/store/api/tendering/bid-price-evaluation.api';
import {
  useLazyGetCanPreliminaryCompleteQuery,
  useSubmitPreliminaryEvaluationMutation,
} from '@/store/api/tendering/preliminary-compliance.api';
import {
  useLazyGetCanPriceAnalysisCompleteQuery,
  useSubmitPriceAnalysisEvaluationMutation,
} from '@/store/api/tendering/price-analysis.api';
import {
  useLazyGetCanQualificationCompleteQuery,
  useSubmitQualificationEvaluationMutation,
} from '@/store/api/tendering/technical-qualification';
import {
  useLazyGetCanResponsivenessCompleteQuery,
  useSubmitResponsivenessEvaluationMutation,
} from '@/store/api/tendering/technical-responsiveness.api';
import { useSubmitScoringEvaluationMutation } from '@/store/api/tendering/technical-scoring.api';
import { useLazyGetLotDetailQuery } from '@/store/api/tendering/tendering.api';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { Section, notify } from '@megp/core-fe';
import { IconChevronLeft, IconNotes, IconSettings } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const LotOverview = ({
  basePath,
  teamAssessment = false,
  hideComplete = false,
  milestone,
  page,
}: {
  basePath: string;
  teamAssessment?: boolean;
  hideComplete?: boolean;
  milestone:
    | 'technicalCompliance'
    | 'technicalQualification'
    | 'technicalResponsiveness'
    | 'technicalScoring'
    | 'financial'
    | 'priceAnalysis';
  page?: 'items' | 'config';
}) => {
  const { tenderId, lotId } = useParams();
  const router = useRouter();

  const [getLot, { data, isLoading }] = useLazyGetLotDetailQuery();
  const [submitPreliminary, { isLoading: isPreliminaryLoading }] =
    useSubmitPreliminaryEvaluationMutation();
  const [submitQualification, { isLoading: isQualificationLoading }] =
    useSubmitQualificationEvaluationMutation();
  const [submitResponsiveness, { isLoading: isResponsivenessLoading }] =
    useSubmitResponsivenessEvaluationMutation();
  const [submitScoring, { isLoading: isScoringLoading }] =
    useSubmitScoringEvaluationMutation();
  const [submitBidPriceEvaluation, { isLoading: isBidPriceLoading }] =
    useSubmitBidPriceEvaluationMutation();
  const [submitPriceAnalysisEvaluation, { isLoading: isPriceAnalysisLoading }] =
    useSubmitPriceAnalysisEvaluationMutation();
  const [getCanPreliminaryComplete, { data: preliminaryCanSubmitData }] =
    useLazyGetCanPreliminaryCompleteQuery();
  const [getCanPriceAnalysisComplete, { data: priceAnalysisCanSubmitData }] =
    useLazyGetCanPriceAnalysisCompleteQuery();
  const [getCanQualificationComplete, { data: qualificationCanSubmitData }] =
    useLazyGetCanQualificationCompleteQuery();
  const [getCanResponsivenessComplete, { data: responsivenessCanSubmitData }] =
    useLazyGetCanResponsivenessCompleteQuery();

  const [lotStatus, setLotStatus] = useState<any>();

  //helpers
  const onSubmit = () => {
    modals.openConfirmModal({
      centered: true,
      title: 'Please confirm your action',
      children: (
        <Text size="sm">Are you sure you want to complete the evaluation?</Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: confirm,
      confirmProps: { color: 'green' },
    });
  };

  const confirm = async () => {
    try {
      if (milestone === 'technicalCompliance') {
        await submitPreliminary({
          lotId: lotId as string,
          tenderId: tenderId as string,
          isTeamLead: teamAssessment,
        }).unwrap();
      } else if (milestone === 'technicalQualification') {
        await submitQualification({
          lotId: lotId as string,
          tenderId: tenderId as string,
          isTeamLead: teamAssessment,
        }).unwrap();
      } else if (milestone === 'technicalResponsiveness') {
        await submitResponsiveness({
          lotId: lotId as string,
          tenderId: tenderId as string,
          isTeamLead: teamAssessment,
        }).unwrap();
      } else if (milestone === 'technicalScoring') {
        await submitScoring({
          lotId: lotId as string,
          tenderId: tenderId as string,
        }).unwrap();
      } else if (milestone === 'financial') {
        await submitBidPriceEvaluation({
          lotId: lotId as string,
          tenderId: tenderId as string,
        }).unwrap();
      } else if (milestone === 'priceAnalysis') {
        await submitPriceAnalysisEvaluation({
          lotId: lotId as string,
          tenderId: tenderId as string,
        }).unwrap();
      }
      router.push(basePath);
      notify('Success', 'Evaluation successfully completed');
    } catch (err) {
      if (err.status == 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  const getLotStatus = async () => {
    try {
      if (milestone === 'technicalCompliance') {
        const res = await getCanPreliminaryComplete(lotId as string).unwrap();
        setLotStatus(res);
      } else if (milestone === 'technicalQualification') {
        const res = await getCanQualificationComplete(lotId as string).unwrap();
        setLotStatus(res);
      } else if (milestone === 'technicalResponsiveness') {
        const res = await getCanResponsivenessComplete(
          lotId as string,
        ).unwrap();
        setLotStatus(res);
      } else if (milestone === 'priceAnalysis') {
        const res = await getCanPriceAnalysisComplete(lotId as string).unwrap();
        setLotStatus(res);
      }
    } catch {
      notify('Error', 'Net Err');
    }
  };

  //use effects
  useEffect(() => {
    getLot({ tenderId: tenderId as string, lotId: lotId as string });
    getLotStatus();
  }, [
    tenderId,
    preliminaryCanSubmitData,
    qualificationCanSubmitData,
    responsivenessCanSubmitData,
    priceAnalysisCanSubmitData,
  ]);
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
              Lot :{' '}
              <Text span className="font-normal text-lg">
                {data?.lots?.[0]?.name ?? ''}
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
          <Group gap="md">
            {milestone === 'financial' && page == 'items' && (
              <Tooltip label="Financial Qualification Config">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() =>
                    router.push(
                      `/evaluation/${tenderId}/${lotId}/financial/config`,
                    )
                  }
                >
                  <IconSettings size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            {milestone === 'financial' && page == 'config' && (
              <Tooltip label="Items">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() =>
                    router.push(`/evaluation/${tenderId}/${lotId}/financial`)
                  }
                >
                  <IconNotes size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            {milestone !== 'technicalScoring' &&
              milestone !== 'financial' &&
              lotStatus?.isTeamLead?.isTeam && (
                <Button
                  variant="outline"
                  onClick={() => {
                    let url = '';
                    if (milestone === 'technicalCompliance' && teamAssessment)
                      url = `/evaluation/${tenderId}/${lotId}/preliminary`;
                    else if (
                      milestone === 'technicalCompliance' &&
                      !teamAssessment
                    )
                      url = `/evaluation/team-assessment/${tenderId}/${lotId}/preliminary`;
                    else if (
                      milestone === 'technicalQualification' &&
                      teamAssessment
                    )
                      url = `/evaluation/${tenderId}/${lotId}/qualification`;
                    else if (
                      milestone === 'technicalQualification' &&
                      !teamAssessment
                    )
                      url = `/evaluation/team-assessment/${tenderId}/${lotId}/qualification`;
                    else if (
                      milestone === 'technicalResponsiveness' &&
                      teamAssessment
                    )
                      url = `/evaluation/${tenderId}/${lotId}/responsiveness`;
                    else if (
                      milestone === 'technicalResponsiveness' &&
                      !teamAssessment
                    )
                      url = `/evaluation/team-assessment/${tenderId}/${lotId}/responsiveness`;

                    router.push(url);
                  }}
                  disabled={!lotStatus?.canTeamAssess}
                >
                  {teamAssessment ? 'Personal Assessment' : 'Team Assessment'}
                </Button>
              )}
            {!hideComplete && (
              <Button
                onClick={onSubmit}
                loading={
                  isPreliminaryLoading ||
                  isQualificationLoading ||
                  isResponsivenessLoading ||
                  isScoringLoading ||
                  isBidPriceLoading ||
                  isPriceAnalysisLoading
                }
                disabled={
                  (milestone === 'technicalScoring'
                    ? false
                    : teamAssessment
                      ? lotStatus?.isTeamLead?.hasCompleted ?? true
                      : lotStatus?.hasCompleted ?? true) &&
                  milestone !== 'financial'
                }
              >
                Complete
              </Button>
            )}
          </Group>
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
                <p>{data?.name}</p>
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
                  Evaluation method :
                </Text>
                <Text fw={500} size="sm">
                  Milestone :
                </Text>
              </Box>
              <Box>
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
