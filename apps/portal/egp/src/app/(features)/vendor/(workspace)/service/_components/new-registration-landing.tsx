import { Box, Button, Flex } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';
import PageWrapper from '../../../_components/page-wrapper';
import AccordionInformation from './accordion-list';

const NewRegistrationLanding = () => {
  const router = useRouter();

  return (
    <PageWrapper
      title="Vendor Registration"
      info="In order to participate in government procurement, business entities
          need to register in the national supplier database. The registration
          service has the following functionalities. In order to participate in
          government procurement, business entities need to register in the
          national supplier database. The registration service has the following
          functionalities."
      key={'page-header'}
    >
      <Flex className="flex-col gap-4">
        <AccordionInformation />
        <Box className="flex justify-end w-full ">
          <Button
            className=" "
            onClick={() => router.push('/vendor/registration/new/basic')}
          >
            Register Now
          </Button>
        </Box>
      </Flex>
    </PageWrapper>
  );
};

export default NewRegistrationLanding;
