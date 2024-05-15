'use client';
import { Box, Container, Flex } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useReadQuery } from '../_api/contract.api';
import { FormDetail } from '../_component/form-detail';
import ContractHeader from '../_component/header';

export default function ContractDetailPage() {
  const [disableFields, setDisableFields] = useState<any>(false);

  const { id } = useParams();

  const { data, isSuccess: succeed } = useReadQuery(id?.toString());

  useEffect(() => {
    succeed &&
      setDisableFields(
        data?.status.toLowerCase() == 'Submitted' &&
          data?.status.toLowerCase() == 'Approved'
          ? false
          : true,
      );
  }, [data, succeed]);

  return (
    <>
      <ContractHeader currentTab={'identification'} />
      <Container size="xl">
        <Box className="mt-5   ">
          <Flex>
            <FormDetail mode="detail" disableFields={disableFields} />
          </Flex>
        </Box>
      </Container>
    </>
  );
}
