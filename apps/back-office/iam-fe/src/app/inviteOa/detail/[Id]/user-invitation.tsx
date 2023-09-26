import { copyToClipboard } from '@/shared/core/utilities/copy-to-clipboard';
import { Button, LoadingOverlay, Tooltip } from '@mantine/core';
import { IconCircleCheck, IconCopy, IconInfoCircle } from '@tabler/icons-react';
import { notify } from '@/shared/ui/page';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useGetInvitedOaByIdQuery,
  useAddInvitedOaMutation,
  useLazyGetUserInvitationLinkQuery,
} from '@/store/api/organization/organization.api';
import { usePathname } from 'next/navigation';

const UserInvitation = () => {
  /* Hooks */
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  const { data: user, isSuccess: isUserFetched } = useGetInvitedOaByIdQuery(
    id?.toString(),
  );
  const [inviteUser, { isLoading: isInvitingUser }] = useAddInvitedOaMutation();
  const [
    trigger,
    {
      data: userInvitationLink,
      isLoading: isUserInvitationLinkFetching,
      isSuccess: isUserInvitationLinkFetched,
    },
  ] = useLazyGetUserInvitationLinkQuery();

  /*Component states */
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const [invitationLink, setInvitationLink] = useState<string>('');

  /* Event handler */
  const onInviteEmployee = async () => {
    try {
      await inviteUser(id?.toString()).unwrap();
      notify(
        'success',
        'Invitation link has be sent to the employee successfully!',
      );
    } catch (err) {
      console.log(err);
      notify(
        'error',
        'Error encountered while sending invitation link to the employee.',
      );
    }
  };

  /*UseEffect hooks  */
  useEffect(() => {
    if (copyStatus) {
      copyToClipboard(invitationLink);
      setTimeout(() => setCopyStatus(false), 1000);
    }
  }, [copyStatus]);

  useEffect(() => {
    if (user?.data?.status === 'invited') {
      trigger(id?.toString(), true);
    }
  }, [id, trigger, user?.data?.status]);

  useEffect(() => {
    if (userInvitationLink) {
      setInvitationLink(userInvitationLink?.data?.link);
    }
  }, [userInvitationLink]);

  return (
    <>
      {
        <div className="bg-white p-4">
          <LoadingOverlay visible={isUserInvitationLinkFetching} />
          <div className="flex border border-[#91d5ff] bg-[#e6f7ff] p-4">
            <span>
              <IconInfoCircle className="flex" size={28} color="#2986cc" />
            </span>
            <div className="ml-4 grow">
              <h3 className="text-base">Personnel Invitation</h3>
              {user?.data?.status === 'invited' &&
                isUserInvitationLinkFetched && (
                  <p className="max-w-[400px] break-all p-4 text-sm">
                    {invitationLink}
                  </p>
                )}

              <Button
                variant="outline"
                onClick={onInviteEmployee}
                loading={isInvitingUser}
                disabled={user?.data?.status.toLowerCase() !== 'draft'}
                className="mt-2 w-full"
              >
                Invite Organization Admin
              </Button>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default UserInvitation;
