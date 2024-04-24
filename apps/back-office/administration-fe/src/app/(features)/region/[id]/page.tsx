'use client';
import { Stack } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
import AddDistrict from '../_component/region-district-relation';
export default function RegionDetailPage() {
  return (
    <Stack>
      <Section title="Region Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddDistrict />
    </Stack>
  );
}
