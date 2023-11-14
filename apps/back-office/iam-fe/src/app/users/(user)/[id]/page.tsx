'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddEntityModal from '../_components/user-unit';
import { Stack } from '@mantine/core';
import AddRole from '../_components/user-role';
import { UserProfileForm } from '../_components/user-profile';
import EmployeeInvitation from '../_components/invitation';

export default function UserDetailPage() {
  return (
    <>
      <Stack>
        <Section title="User Detail">
          <FormDetail mode="detail" />
        </Section>
        <AddEntityModal />
        <AddRole />
        <Section title="Extended Profile" defaultCollapsed>
          <UserProfileForm />
        </Section>
      </Stack>

      <EmployeeInvitation />
    </>
  );
}
