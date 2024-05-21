import TechnicalBidSubmissionSheet from './technical-bid-submission-sheet';
import { Box } from '@mantine/core';
import BidderInformation from './bidder-information';
import DocumentaryEvidence from './documentary-evidence';
import JvMemberInformation from './jv-members/jv-member-information';
import PersonnelCapabilities from './personnel-capabilities/personnel-capabilities';
import { useSearchParams } from 'next/navigation';
import { IconFolderOpen } from '@tabler/icons-react';

const BidDeclarationPage = () => {
  const searchParams = useSearchParams();
  return (
    <>
      {searchParams.get('lot') ? (
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
      ) : (
        <>
          <div className="w-full bg-white flex flex-col h-96 justify-center items-center">
            <IconFolderOpen className="w-32 h-16 stroke-1" />
            <p className="text-base font-semibold">no lot selected</p>
            <p>Please Select a lot first</p>
          </div>
        </>
      )}
    </>
  );
};

export default BidDeclarationPage;
