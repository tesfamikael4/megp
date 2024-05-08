'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
import ContractBeneficiary from '../_component/contract-beneficiary';
export default function ContractDetailPage() {
  return (
    <Stack>
      <Section title="Contract Detail">
        <FormDetail mode="detail" />
      </Section>

      <ContractBeneficiary />
    </Stack>
  );
}
