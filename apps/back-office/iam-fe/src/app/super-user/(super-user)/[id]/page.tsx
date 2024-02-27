'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

import { Stack } from '@mantine/core';

import EmployeeInvitation from '../../../users/(user)/_components/invitation';
import AddSystemRole from '../../../users/(user)/_components/user-system-role';

export default function UserDetailPage() {
  return (
    <>
      <Stack>
        <Section title="User Detail">
          <FormDetail mode="detail" />
        </Section>

        <AddSystemRole />

        <EmployeeInvitation />
      </Stack>
    </>
  );
}
