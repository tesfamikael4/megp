import React, { useEffect, useState } from 'react';
import {
  Modal,
  rem,
  ActionIcon,
  Tooltip,
  CopyButton,
  Box,
  LoadingOverlay,
  Group,
  Menu,
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
        'Error encountered while sending invitation link to the user.',
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
      <Menu shadow="md">
        <Menu.Target>
          <IconDotsVertical className="ml-auto text-gray-500" size={16} />
        </Menu.Target>

        <Menu.Dropdown>
          {userInvited == null && (
            <Menu.Item
              leftSection={<IconEye size={15} />}
              onClick={OnInviteUser}
            >
              Invite User
            </Menu.Item>
          )}
          {userInvited !== null && (
            <Menu.Item
              leftSection={<IconEye size={15} />}
              onClick={() => setViewLink(true)}
            >
              View link
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>

      <Modal
        title={'View link'}
        opened={viewLink}
        onClose={() => setViewLink(false)}
        size={'lg'}
      >
        <Group className="bg-white p-4 mt-1">
          <Box pos={'relative'}>
            <LoadingOverlay visible={isLoading} />
            <div className="flex border border-[#91d5ff] bg-[#e6f7ff] p-4">
              <span>
                <IconInfoCircle className="flex" size={28} color="#2986cc" />
              </span>
              <div className="ml-4 grow">
                <h3 className="text-base">User Invitation</h3>
                {userInvited && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </Box>
        </Group>
      </Modal>
    </Group>
  );
}
