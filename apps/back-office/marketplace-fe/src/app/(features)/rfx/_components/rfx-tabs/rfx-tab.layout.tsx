'use client';
import {
  Box,
  Button,
  Container,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, use, useEffect, useState } from 'react';
import { IconChevronLeft } from '@tabler/icons-react';
import { useReadQuery } from '../../_api/rfx/rfx.api';
import { logger } from '@megp/core-fe';
import {
  useCancelRFXMutation,
  useLazyCanSubmitForReviewQuery,
  useMakeRFXOpenMutation,
  useSubmitForReviewMutation,
} from '@/store/api/rfx/rfx.api';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import { ERfxStatus } from '@/enums/rfx-status';

export default function RFXTabs({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname() as string;
  const paths = pathname.split('/');
  const path = [paths[paths.length - 1], paths[paths.length - 2]];
  const activeTabStyle =
    'bg-gray-100 cursor-pointer border-l border-r border-t py-2 px-10 rounded-t text-gray-700 font-medium';
  const inActiveTabStyle =
    'cursor-pointer py-2 px-10 text-gray-700 font-medium';
  const { data, isLoading: isGettingDetail } = useReadQuery(id?.toString());
  const [submitForReview, { isLoading: isSubmitting }] =
    useSubmitForReviewMutation();
  // const [submitStatus, { data: canSubmitForReview }] =
  //   useLazyCanSubmitForReviewQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [rfxType, setRfxType] = useState('invitation');
  const [reviewDeadline, setReviewDeadline] = useState<Date | null>(null);
  const [cancelRFX, { isLoading: isCancelling }] = useCancelRFXMutation();
  const [makeRFXOpen, { isLoading: isMakingRFXOpen }] =
    useMakeRFXOpenMutation();
  const [makeRFXClosed, { isLoading: isMakingRFXClosed }] =
    useMakeRFXOpenMutation();

  // useEffect(() => {
  //   submitStatus({ rfxId: id.toString() });
  // }, [id]);

  const handleSubmit = async ({ mode }: { mode: string }) => {
    try {
      if (mode == 'submit' && rfxType == 'invitation')
        await submitForReview({ id: id.toString(), reviewDeadline }).unwrap();
      else if (mode == 'cancel')
        await cancelRFX({ rfxId: id.toString() }).unwrap();
      else if (mode == 'submit' && rfxType == 'open')
        await makeRFXOpen({ rfxId: id.toString() });
      else if (mode == 'close')
        await makeRFXClosed({ rfxId: id.toString() }).unwrap();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `RFQ ${mode == 'submit' && rfxType == 'invitation' ? 'Submitted' : mode == 'cancel' ? 'Cancelled' : mode == 'close' ? 'Made Closed' : mode == 'submit' && rfxType == 'open' ? 'Made Open' : ''} Successfully`,
      });
      mode == 'submit' && router.push('/revision');
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: err?.data?.message,
      });
    }
  };

  return (
    <>
      <Box className="bg-white">
        <Modal opened={opened} onClose={close} title="Review Deadline">
          <Stack>
            <p>Please select review deadline before proceeding.</p>
            <DateTimePicker
              value={reviewDeadline}
              onChange={setReviewDeadline}
              label="Select Review Deadline"
              placeholder="Select Review Dealine"
              minDate={new Date()}
              defaultValue={new Date()}
            />
            <Button
              className="ml-auto"
              loading={isSubmitting}
              onClick={async () => await handleSubmit({ mode: 'submit' })}
            >
              Continue
            </Button>
          </Stack>
        </Modal>
        <Container size="xl">
          <Flex align="center" className="gap-2 py-8">
            <IconChevronLeft
              size={24}
              className="cursor-pointer"
              onClick={() => router.push('/rfx')}
            />
            <Text className="font-semibold text-xl">{data?.name ?? ''}</Text>
            <Flex className="ml-auto gap-2">
              <Button
                className="bg-red-500"
                loading={isCancelling}
                onClick={async () => await handleSubmit({ mode: 'cancel' })}
              >
                Cancel RFX
              </Button>
              {!data?.isOpen && (
                <Button
                  variant={'outline'}
                  loading={isMakingRFXOpen}
                  onClick={() => {
                    setRfxType('open');
                    open();
                  }}
                  disabled={
                    !(
                      data?.status == ERfxStatus.ADJUSTMENT ||
                      data?.status == ERfxStatus.DRAFT
                    )
                  }
                >
                  Make RFQ Open
                </Button>
              )}
              {data?.isOpen && (
                <Button
                  variant={'outline'}
                  loading={isMakingRFXClosed}
                  onClick={() => {
                    handleSubmit({ mode: 'close' });
                  }}
                  disabled={
                    !(
                      data?.status == ERfxStatus.ADJUSTMENT ||
                      data?.status == ERfxStatus.DRAFT
                    )
                  }
                >
                  Make RFQ Closed
                </Button>
              )}
              <Button
                loading={isSubmitting}
                onClick={() => {
                  setRfxType('invitation');
                  open();
                }}
                disabled={
                  !(
                    data?.status == ERfxStatus.ADJUSTMENT ||
                    data?.status == ERfxStatus.DRAFT
                  )
                }
              >
                Submit for review
              </Button>
            </Flex>
          </Flex>
          <Flex gap={10} className="mt-2 ml-2 ">
            <Box
              className={
                path.includes('configuration')
                  ? activeTabStyle
                  : inActiveTabStyle
              }
              onClick={() => router.push(`/rfx/${id}/configuration`)}
            >
              Definition
            </Box>
            <Box
              className={
                path.includes('items') ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => router.push(`/rfx/${id}/items`)}
            >
              Items
            </Box>
            <Box
              className={
                path.includes('bidding-procedure')
                  ? activeTabStyle
                  : inActiveTabStyle
              }
              onClick={() => router.push(`/rfx/${id}/bidding-procedure`)}
            >
              Bidding Procedure
            </Box>
            <Box
              className={
                path.includes('evaluation-criteria')
                  ? activeTabStyle
                  : inActiveTabStyle
              }
              onClick={() => router.push(`/rfx/${id}/evaluation-criteria`)}
            >
              Evaluation Criteria
            </Box>
            <Box
              className={
                path.includes('contract-conditions')
                  ? activeTabStyle
                  : inActiveTabStyle
              }
              onClick={() => router.push(`/rfx/${id}/contract-conditions`)}
            >
              Contract Conditions
            </Box>
            <Box
              className={
                path.includes('invitation') ? activeTabStyle : inActiveTabStyle
              }
              onClick={() => router.push(`/rfx/${id}/invitation`)}
            >
              Invitation
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box>
        <LoadingOverlay visible={isGettingDetail} />
        <Container size="xl">
          <Box className="mt-5 -mx-4 ">{children}</Box>
        </Container>
      </Box>
    </>
  );
}
