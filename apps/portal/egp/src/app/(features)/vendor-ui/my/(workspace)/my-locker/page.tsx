import { Box, Card, Flex, Text, TextInput } from '@mantine/core';
import React from 'react';
import PageWrapper from '../_components/page-wrapper';
import { IconCheck, IconSearch } from '@tabler/icons-react';
import NotificationList from './_components/notification-list';

type Props = {};

const Page = (props: Props) => {
  return (
    <Flex className="flex-col gap-2  min-h-fit">
      <PageWrapper
        title="Notifications"
        info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet interdum velit libero nec risus. Aliquam non libero dolor."
        actions={
          <TextInput
            size="xs"
            maw={300}
            w="100%"
            leftSection={<IconSearch size={18} />}
            placeholder="Search files by lorem, lorem"
            rightSectionWidth={30}
          />
        }
        mih={200}
      ></PageWrapper>
      <Flex className="flex-col gap-2">
        <NotificationList />
      </Flex>
    </Flex>
  );
};

export default Page;
