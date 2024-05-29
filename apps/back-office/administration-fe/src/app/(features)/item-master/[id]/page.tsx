'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import { Builder } from '../_components/table-builder';
import { Stack } from '@mantine/core';
import { useState } from 'react';

export default function ItemMasterDetailPage() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <Stack>
        <Section title="Item MasterDetail" collapsible={true}>
          <FormDetail mode="detail" />
        </Section>

        <Section
          title="Specification Template"
          collapsible={true}
          defaultCollapsed={true}
          setIsCollapsed={setIsCollapsed}
        >
          <Builder isCollapsed={isCollapsed} />
        </Section>
      </Stack>
    </>
  );
}
