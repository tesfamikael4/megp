'use client';
import ContractBeneficiary from '@/app/(features)/contract-catalogs/_component/contract-beneficiary';
import ContractHeader from '@/app/(features)/contract-catalogs/_component/header';
import { Box, Container } from '@mantine/core';

export default function ContractCatalogBeneficiary() {
  return (
    <>
      <ContractHeader currentTab={'beneficiary'} />
      <Container size="xl">
        <Box className="mt-5  -mx-4 ">
          <ContractBeneficiary />
        </Box>
      </Container>
    </>
  );
}
