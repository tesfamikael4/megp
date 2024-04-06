import React, { useContext, useEffect } from 'react';
import TechnicalBidSubmissionSheet from './technical-bid-submission-sheet';
import { Box } from '@mantine/core';
import BidderInformation from './bidder-information';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import { logger } from '@megp/core-fe';
import DocumentaryEvidence from './documentary-evidence';
import JvMemberInformation from './jv-member-information';
import PersonnelCapabilities from './personnel-capabilities';

const BidDeclarationPage = () => {
  const password = useContext(PrepareBidContext);
  useEffect(() => {
    logger.log(password);
  }, [password]);
  return (
    <>
      <Box className="my-2">
        <TechnicalBidSubmissionSheet />
      </Box>
      <Box className="my-2">
        <BidderInformation />
      </Box>
      <Box className="my-2">
        <DocumentaryEvidence />
      </Box>
      <Box className="my-2">
        <JvMemberInformation />
      </Box>
      <Box className="my-2">
        <PersonnelCapabilities />
      </Box>
    </>
  );
};

export default BidDeclarationPage;
