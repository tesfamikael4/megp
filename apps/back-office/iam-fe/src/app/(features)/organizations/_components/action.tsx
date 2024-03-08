import React, { useEffect, useState } from 'react';
import {
  Modal,
  rem,
  ActionIcon,
  Button,
  Tooltip,
  CopyButton,
  Box,
  LoadingOverlay,
  Group,
  Text,
} from '@mantine/core';
import {
  useInviteUserMutation,
  useLazyGetUserInvitationLinkQuery,
} from '../../../users/_api/custom.api';

import { notify } from '@megp/core-fe';
import {
  IconCheck,
  IconCopy,
  IconDotsVertical,
  IconEye,
  IconInfoCircle,
  IconMailForward,
} from '@tabler/icons-react';
import { User } from '@/models/user/user';

interface invitationProps {
  user: User;
}

export default function Invitation({ user }: invitationProps) {
  const [viewLink, setViewLink] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState('');

  const [trigger, { data: userInvited, isLoading, isSuccess }] =
    useLazyGetUserInvitationLinkQuery();
  const [inviteUser] = useInviteUserMutation();

  const OnInviteUser = async () => {
    try {
      await inviteUser({ id: user?.id }).unwrap();
      notify(
        'Success',
        'Invitation link has be sent to the user successfully!',
      );
    } catch (err) {
      notify(
        'Error',
        `${
          err.data.message === 'organization_is_not_active'
            ? 'The organization needs to be activated before inviting the administrator'
            : 'Error encountered while sending invitation link to the user.'
        }`,
      );
    }
  };

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    trigger(user?.id);
  }, [user, trigger, viewLink]);

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
          `${decodeURIComponent(key)}=${decodeURIComponent(value)}`,
      );
      const finalURL = `${baseUrl}/iam/users/${userInvited.setPassword ? 'set-password' : 'accept-invitation'}/?&${queryParams.join(
        '&',
      )}`;
      setInvitationLink(finalURL);
    }
  }, [isSuccess, userInvited, baseUrl]);

  return (
    <Group justify="end">
      {userInvited == null && (
        <Button
          leftSection={<IconMailForward size={15} />}
          onClick={OnInviteUser}
        >
          Invite User
        </Button>
      )}
      {userInvited !== null && userInvited !== undefined && (
        <Button
          leftSection={<IconEye size={15} />}
          onClick={() => setViewLink(true)}
          ml={5}
          mr={5}
        >
          View Link
        </Button>
      )}

      <Modal
        title={<Text fw={'bold'}>View Link</Text>}
        opened={viewLink}
        onClose={() => setViewLink(false)}
        size={'lg'}
      >
        <Box className="bg-white p-4 mt-1">
          <Box pos={'relative'}>
            <LoadingOverlay visible={isLoading} />
            <div className="flex border w-{w-full} border-[#91d5ff] bg-[#e6f7ff] p-4">
              <span>
                <IconInfoCircle className="flex" size={28} color="#2986cc" />
              </span>
              <div className="ml-4 grow">
                <h3 className="text-base">User Invitation</h3>
                {userInvited && (
                  <>
                    {userInvited.status === 'USED' ? (
                      <h3>User already accepted invitation</h3>
                    ) : (
                      <p className="max-w-[600px] break-all p-4 text-sm">
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
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </Group>
  );
}
