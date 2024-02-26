'use client';
import { Section, logger } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddEntityModal from '../_components/add-mandate';
import { Stack } from '@mantine/core';
import AddOa from '../_components/Invitation';
import { useParams } from 'next/navigation';
import { useLazySecondRelationQuery } from '../_api/organization-mandate.api';
import { useEffect } from 'react';

export default function OrganizationPage() {
  const { id } = useParams();
  const [trigger, { data: mandateList }] = useLazySecondRelationQuery();

  useEffect(() => {
    if (id) {
      trigger({
        id: id?.toString(),
        collectionQuery: undefined,
      });
    }
  }, [id, trigger]);

  return (
    <Stack>
      <Section title="Organization Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddEntityModal />
      {mandateList?.total !== 0 && <AddOa />}
    </Stack>
  );
}
