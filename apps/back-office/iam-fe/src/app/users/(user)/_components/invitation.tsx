import {
  ActionIcon,
  Box,
  Button,
  CopyButton,
  LoadingOverlay,
  Tooltip,
  rem,
} from '@mantine/core';
import { IconCheck, IconCopy, IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  useInviteUserMutation,
  useLazyGetUserInvitationLinkQuery,
} from '../../_api/custom.api';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';

const UserInvitation = () => {
  const { id } = useParams();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const [inviteUser, { isLoading: isInvitingUser }] = useInviteUserMutation();
  const [trigger, { data: userInvited, isLoading, isSuccess }] =
    useLazyGetUserInvitationLinkQuery();

  const [invitationLink, setInvitationLink] = useState<string>('');

  const OnInviteUser = async () => {
    try {
      await inviteUser({ id: id?.toString() }).unwrap();
      notify(
        'Success',
        'Invitation link has be sent to the user successfully!',
      );
    } catch (err) {
      notify(
        'Error',
        `${
          err.data.message === 'user_role_and_unit_not_assigned'
            ? 'Assign unit and role before invitation'
            : 'Error encountered while sending invitation link to the user'
        }`,
      );
    }
  };

  useEffect(() => {
    trigger(id?.toString());
  }, [id, trigger]);

  useEffect(() => {
    if (isSuccess) {
      const obj = {
        firstName: userInvited?.firstName,
        lastName: userInvited?.lastName,
        id: userInvited?.id,
        otp: userInvited?.otp,
      };
      const queryParams = Object.entries(obj).map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      );
      if (userInvited?.setPassword === false) {
        const finalURL = `${baseUrl}/iam/users/accept-invitation?&${queryParams.join(
          '&',
        )}`;
        setInvitationLink(finalURL);
      } else {
        const finalURL = `${baseUrl}/iam/users/set-password?&${queryParams.join(
          '&',
        )}`;
        setInvitationLink(finalURL);
      }
    }
  }, [isSuccess, userInvited, baseUrl]);

  return (
    <>
      <div className="bg-white p-4 mt-1">
        <Box pos={'relative'}>
          <LoadingOverlay visible={isLoading} />
          <div className="flex border border-[#91d5ff] bg-[#e6f7ff] p-4">
            <span>
              <IconInfoCircle className="flex" size={28} color="#2986cc" />
            </span>
            <div className="ml-4 grow">
              {isSuccess && userInvited?.status === 'USED' ? (
                <h3>User already accepted invitation </h3>
              ) : (
                invitationLink && (
                  <>
                    <h3 className="text-base">User Invitation</h3>
                    {userInvited !== null && (
                      <p className="min-w-[600px] break-all p-4 text-sm">
                        {invitationLink}

                        <CopyButton value={invitationLink} timeout={2000}>
                          {({ copied, copy }) => (
                            <Tooltip
                              label={copied ? 'Copied' : 'Copy'}
                              withArrow
                              position="right"
                            >
                              <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                variant="subtle"
                                onClick={copy}
                              >
                                {copied ? (
                                  <IconCheck style={{ width: rem(16) }} />
                                ) : (
                                  <IconCopy style={{ width: rem(16) }} />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </p>
                    )}
                  </>
                )
              )}

              <Button
                variant="outline"
                onClick={OnInviteUser}
                loading={isInvitingUser}
                disabled={userInvited}
                className="mt-2 w-full"
              >
                Invite User
              </Button>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
};

export default UserInvitation;
