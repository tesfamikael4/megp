'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import { Stack } from '@mantine/core';
import AddUserModal from '../_components/add-permission';
import { useParams } from 'next/navigation';
import { useReadQuery } from '../_api/role.api';
import { SystemRole } from '../_components/system-role';

export default function RoleDetailPage() {
  const { id } = useParams();

  const { data: selected } = useReadQuery(id?.toString());

  return (
    <Stack>
      <Section title="Role detail">
        {selected?.isSystemRole ? (
          <SystemRole mode="detail" />
        ) : (
          <FormDetail mode="detail" />
        )}
      </Section>
      <AddUserModal />
    </Stack>
  );
}
