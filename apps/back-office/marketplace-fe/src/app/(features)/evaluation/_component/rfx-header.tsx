'use client';
import {
  Badge,
  Button,
  Flex,
  LoadingOverlay,
  Text,
  Tooltip,
} from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';
import { useReadQuery } from '../../rfx/_api/rfx/rfx.api';
import { Section, logger } from '@megp/core-fe';
import {
  useLazyCanStartTeamAssesmentQuery,
  useLazyCanSubmitRFQQuery,
  useLazyCheckIsTeamLeadQuery,
  useSubmitRFXEvaluationMutation,
} from '@/store/api/rfx/rfx.api';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';

export default function RFXHeader() {
  const router = useRouter();
  const { id, assessmentMode } = useParams();
  const { data, isLoading: isGettingDetail } = useReadQuery(id?.toString());

  const [canSubmit, { data: submitStatus }] = useLazyCanSubmitRFQQuery();
  const [canStartTeamAssess, { data: canAssessTeam }] =
    useLazyCanStartTeamAssesmentQuery();
  const [checkIsTeamLead, { data: isTeamLead }] = useLazyCheckIsTeamLeadQuery();
  const [submitRFX, { isLoading: isSubmtting }] =
    useSubmitRFXEvaluationMutation();

  useEffect(() => {
    checkIsTeamLead({ rfxId: id.toString() });
    canSubmit({
      rfxId: id.toString(),
      isTeamAssessment: assessmentMode == 'team',
    });
    canStartTeamAssess({ rfxId: id.toString() });
  }, []);

  const handleComplete = async () => {
    try {
      await submitRFX({
        rfxId: id.toString(),
        isTeamAssessment: assessmentMode == 'team',
      }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Completed Successfully.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err?.data?.message,
        color: 'red',
      });
    }
  };

  return (
    <>
      <Section
        title={
          <Flex align="center" className="gap-2 pt-1 pb-1 items-center">
            <IconChevronLeft
              size={20}
              className="cursor-pointer"
              onClick={() => router.push('/evaluation')}
            />
            <Text className="font-semibold">{data?.name ?? ''}</Text>
            {assessmentMode == 'team' && <Badge>Team Assessment</Badge>}
          </Flex>
        }
        action={
          <Flex className="gap-4">
            {assessmentMode == 'personal' && isTeamLead && (
              <Tooltip
                label={`${canAssessTeam?.reason ?? null}`}
                hidden={!canAssessTeam?.reason}
              >
                <Button
                  variant="outline"
                  onClick={() => router.push(`/evaluation/${id}/team`)}
                  disabled={!canAssessTeam?.canSubmit}
                >
                  Team Assessment
                </Button>
              </Tooltip>
            )}
            {assessmentMode == 'team' && (
              <Button
                variant="outline"
                onClick={() => router.push(`/evaluation/${id}/personal`)}
              >
                Personal Assessment
              </Button>
            )}
            <Tooltip
              label={`${submitStatus?.reason ?? null}`}
              hidden={!submitStatus?.reason}
            >
              <Button
                disabled={!submitStatus?.canSubmit}
                onClick={handleComplete}
                loading={isSubmtting}
              >
                Complete
              </Button>
            </Tooltip>
          </Flex>
        }
        collapsible={false}
      >
        <LoadingOverlay visible={isGettingDetail} />
        <Flex className="gap-72 mb-2">
          <Flex className="px-6 flex-col gap-2">
            <Flex className="gap-2 items-center">
              <p>Ref no:</p>
              <Badge variant="outline">
                {data?.procurementReferenceNumber}
              </Badge>
            </Flex>
            <Flex className="gap-2 items-center">
              <p>Total bidders:</p>
              <Badge variant="outline">{data?.bidders ?? '-'}</Badge>
            </Flex>
          </Flex>
          <Flex className="px-6 flex-col gap-2">
            <Flex className="gap-2 items-center">
              <p>Is Open:</p>
              <Badge variant="outline">{data?.isOpen ? 'true' : 'false'}</Badge>
            </Flex>
            <Flex className="gap-2 items-center">
              <p>Status:</p>
              <Badge variant="outline">{data?.status}</Badge>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </>
  );
}
