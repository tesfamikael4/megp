'use client';
import { useLazyGetTenderDetailQuery } from '@/store/api/tendering/tendering.api';
import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Group,
  LoadingOverlay,
  Text,
  Tooltip,
  Button,
} from '@mantine/core';
import { Section, notify } from '@megp/core-fe';
import { IconChevronLeft, IconEye } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { modals } from '@mantine/modals';
import {
  useSubmitOpeningMutation,
  useGetTenderOpeningStatusQuery,
} from '@/store/api/tendering/tender-opening.api';

export const TenderOverView = ({
  basePath,
  hideActions = false,
  teamAssessment = false,
}: {
  basePath: string;
  hideActions?: boolean;
  teamAssessment?: boolean;
}) => {
  const { tenderId } = useParams();
  const router = useRouter();
  const [getTender, { data, isLoading }] = useLazyGetTenderDetailQuery();
  const [submit, { isLoading: isSubmitting }] = useSubmitOpeningMutation();
  const { data: tenderStatus } = useGetTenderOpeningStatusQuery(
    tenderId as string,
  );

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
      await submit({
        tenderId: tenderId as string,
        isTeamLead: teamAssessment,
      }).unwrap();
      notify('Success', 'All tenders opened successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getTender(tenderId as string);
  }, [tenderId]);
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Section
        title={
          <Flex align="center">
            <Flex
              justify="center"
              align="center"
              onClick={() => router.push(basePath)}
              className="cursor-pointer"
            >
              <IconChevronLeft size={14} />
              <Text className="font-semibold text-lg">
                Tender :
                <Text span className="font-normal text-lg">
                  {' '}
                  {data?.name ?? ''}
                </Text>
              </Text>
            </Flex>
            {teamAssessment && (
              <Badge className="ml-3" size="xs">
                Team Assessment
              </Badge>
            )}
          </Flex>
        }
        subTitle={data?.procurementReferenceNumber ?? ''}
        collapsible={false}
        action={
          hideActions ? null : (
            <Group gap="md">
              {tenderStatus?.isTeamLead?.hasCompleted && (
                <Tooltip label="Show opening minute">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => router.push(`/opening/minute/${tenderId}`)}
                  >
                    <IconEye size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
              {tenderStatus?.isTeamLead?.isTeam && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (teamAssessment)
                      router.push(`/opening/${tenderId}/lots`);
                    else router.push(`/opening/team-assessment/${tenderId}`);
                  }}
                  disabled={!tenderStatus?.canTeamAssess}
                >
                  {teamAssessment ? 'Personal Assessment' : 'Team Assessment'}
                </Button>
              )}
              <Button
                onClick={onSubmit}
                loading={isSubmitting}
                disabled={tenderStatus?.hasCompleted}
              >
                Complete
              </Button>
            </Group>
          )
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
                  Award Type :
                </Text>
              </Box>
              <Box>
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
                  Status :
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
                      {data?.status}
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
