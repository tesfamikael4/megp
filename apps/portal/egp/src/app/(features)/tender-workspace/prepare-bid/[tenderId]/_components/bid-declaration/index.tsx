import TechnicalBidSubmissionSheet from './technical-bid-submission-sheet';
import { Box } from '@mantine/core';
import BidderInformation from './bidder-information';
import DocumentaryEvidence from './documentary-evidence';
import JvMemberInformation from './jv-members/jv-member-information';
import PersonnelCapabilities from './personnel-capabilities/personnel-capabilities';
import { useSearchParams } from 'next/navigation';

const BidDeclarationPage = () => {
  const searchParams = useSearchParams();
  return (
    <>
      {!searchParams.get('lot') ? (
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
        </>
      ) : (
        <>
          <Box className="my-2">
            <JvMemberInformation />
          </Box>
          <Box className="my-2">
            <PersonnelCapabilities />
          </Box>
        </>
      )}
    </>
  );
};

export default BidDeclarationPage;
