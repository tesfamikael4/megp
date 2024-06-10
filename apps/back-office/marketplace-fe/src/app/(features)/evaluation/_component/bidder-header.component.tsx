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
import { useEffect } from 'react';
import {
  useLazyCanSubmitEvaluationQuery,
  useSubmitEvaluationMutation,
} from '@/store/api/rfx/rfx.api';
import { notifications } from '@mantine/notifications';

export default function BidderHeader() {
  const router = useRouter();
  const { id, bidderId, assessmentMode } = useParams();
  const { data, isLoading: isGettingDetail } = useReadQuery(id?.toString());

  const [canSubmit, { data: submitStatus }] = useLazyCanSubmitEvaluationQuery();
  const [submit, { isLoading: isSubmitting }] = useSubmitEvaluationMutation();

  const onComplete = async () => {
    try {
      await submit({
        bidderId: bidderId.toString(),
        isTeamAssessment: assessmentMode == 'team' ? true : false,
      }).unwrap();
      canSubmit({
        bidderId: bidderId.toString(),
        isTeamAssessment: assessmentMode == 'team' ? true : false,
      });
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

  useEffect(() => {
    canSubmit({
      bidderId: bidderId.toString(),
      isTeamAssessment: assessmentMode == 'team' ? true : false,
    });
  }, []);

  return (
    <>
      <Section
        title={
          <Flex align="center" className="gap-2 pt-1 pb-1">
            <IconChevronLeft
              size={20}
              className="cursor-pointer"
              onClick={() => router.push(`/evaluation/${id}/${assessmentMode}`)}
            />
            <Text className="font-semibold">{'Vendor 1' ?? ''}</Text>
          </Flex>
        }
        action={
          <Tooltip label={submitStatus?.reason} hidden={!submitStatus?.reason}>
            <Button
              disabled={!submitStatus?.canSubmit}
              onClick={onComplete}
              loading={isSubmitting}
            >
              Complete
            </Button>
          </Tooltip>
        }
        collapsible={false}
      >
        <Flex className="gap-72 mb-2">
          <Flex className="px-6 flex-col gap-2">
            <LoadingOverlay visible={isGettingDetail} />
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
