'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';
import AddEntityModal from '../_components/user-unit';
import { Stack } from '@mantine/core';
import AddRole from '../_components/user-role';
import EmployeeInvitation from '../_components/invitation';
import AddSystemRole from '../_components/user-system-role';
import ResetPassword from '../_components/reset-password';
import { useAuth } from '@megp/auth';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLazyGetUserInvitationLinkQuery } from '../../_api/custom.api';

export default function UserDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [permissions, setPermissions] = useState<any>([]);

  useEffect(() => {
    const permission =
      user &&
      user?.organizations?.[0]?.permissions.filter((p) => {
        return p.key === 'iam:user';
      });

    setPermissions(permission);
  }, [user, id]);

  const [trigger, { data: userInvited, isSuccess }] =
    useLazyGetUserInvitationLinkQuery();

  useEffect(() => {
    if (id) {
      trigger(id.toString());
    }
  }, [id, trigger]);

  return (
    <>
      <Stack>
        <Section title="User Detail">
          <FormDetail mode="detail" />
        </Section>
        <AddEntityModal />
        <AddRole />
        <AddSystemRole />

        {permissions?.length !== 0 &&
          isSuccess &&
          userInvited?.status === 'USED' && (
            <Section title="Reset Password" defaultCollapsed>
              <ResetPassword />
            </Section>
          )}

        <EmployeeInvitation />
      </Stack>
    </>
  );
}
