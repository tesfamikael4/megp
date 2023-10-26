'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddEntityModal from '../_components/user-unit';
import { Stack } from '@mantine/core';
import AddRole from '../_components/user-role';
import AddGroup from '../_components/user-group';
import { UserProfileForm } from '../_components/user-profile';

export default function UserDetailPage() {
  return (
    <Stack>
      <Section title="User Detail">
        <FormDetail mode="detail" />
      </Section>
      <AddEntityModal />
      <AddRole />
      <AddGroup />
      <Section title="Extended Profile" defaultCollapsed>
        <UserProfileForm />
      </Section>
    </Stack>
  );
}
