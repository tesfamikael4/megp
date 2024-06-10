'use client';
import { Box, Flex, LoadingOverlay, Stack } from '@mantine/core';
import React, { useEffect } from 'react';
import Requirments from './requirments';
import { PreviewDocument } from './preview-submitted-document';
import BidderHeader from './bidder-header.component';
import Compliance from './compliance-form.component';
import {
  useGetMyResponsesQuery,
  useLazyGetMyResponsesQuery,
} from '@/store/api/rfx/rfx.api';
import { useParams, useRouter } from 'next/navigation';
import { logger } from '@megp/core-fe';

export default function AsssesmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, bidderId, requirmentId, assessmentMode } = useParams();
  const router = useRouter();
  const [
    getRequirments,
    { data: requirments, isLoading: isGettingRequirments },
  ] = useLazyGetMyResponsesQuery();

  useEffect(() => {
    if (requirments) {
      router.push(
        requirments?.[0]?.id
          ? `/evaluation/${id}/${assessmentMode}/${bidderId}/${requirments?.[0]?.id}`
          : '1',
      );
      logger.log(requirments?.[0]?.id);
    }
  }, [requirments]);

  useEffect(() => {
    getRequirments({
      rfxId: id.toString(),
      isTeamAssessment: assessmentMode == 'team' ? true : false,
      bidderId: bidderId.toString(),
    });
  }, [bidderId, assessmentMode]);

  return (
    <Stack>
      <BidderHeader />
      <Flex className="gap-2">
        <Box className="w-1/4">
          <Requirments />
        </Box>
        <LoadingOverlay visible={isGettingRequirments} />
        {requirments && requirmentId && (
          <Box className="w-2/4">
            <PreviewDocument />
          </Box>
        )}
        {requirments && requirmentId && (
          <Box className="w-1/4">
            <Compliance />
          </Box>
        )}
      </Flex>
    </Stack>
  );
}
