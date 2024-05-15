'use client';
import ContractBeneficiary from '@/app/(features)/contract-catalogs/_component/contract-beneficiary';
import ContractHeader from '@/app/(features)/contract-catalogs/_component/header';
import ContractItemPrice from '@/app/(features)/contract-catalogs/_component/item-price';
import { Box, Container } from '@mantine/core';

export default function ContractCatalogBeneficiary() {
  return (
    <>
      <ContractHeader currentTab={'contractItem'} />
      <Container size="xl">
        <Box className="mt-5  -mx-4">
          <ContractItemPrice />
        </Box>
      </Container>
    </>
  );
}
