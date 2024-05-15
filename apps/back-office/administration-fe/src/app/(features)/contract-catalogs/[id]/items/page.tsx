'use client';
import ContractHeader from '@/app/(features)/contract-catalogs/_component/header';
import { Box, Container } from '@mantine/core';
import ContractItem from '../../_component/contract-item';

export default function ContractCatalogBeneficiary() {
  return (
    <>
      <ContractHeader currentTab={'contractItem'} />
      <Container size="xl">
        <Box className="mt-5  -mx-4">
          <ContractItem />
        </Box>
      </Container>
    </>
  );
}
