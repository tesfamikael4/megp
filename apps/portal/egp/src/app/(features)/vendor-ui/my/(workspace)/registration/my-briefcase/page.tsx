'use client';

import { Flex, TextInput } from '@mantine/core';
import { Text, Button } from '@mantine/core';
import React from 'react';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { MyBriefcaseIcon } from './_components/placeholder-icon';
import PageWrapper from '../../_components/page-wrapper';
// import { useDebouncedState } from '@mantine/hooks';
function Page() {
  return (
    <>
      <PageWrapper
        title="My Briefcase"
        info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            faucibus, enim ac dictum rutrum, velit quam pharetra mi, aliquet
            interdum velit libero nec risus. Aliquam non libero dolor."
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
        headerRight={
          <Button leftSection={<IconPlus size={16} stroke={2.2} />}>Add</Button>
        }
        placeholder={
          <Flex className=" flex-col gap-3 w-full h-full flex items-center justify-center mt-24">
            <MyBriefcaseIcon />
            <Text fw={500} fz={18}>
              Get Started!
            </Text>
            <Text fw={500} fz={14} c="#464665">
              No documents have been added!
            </Text>
            <Button variant="outline">Add Documents</Button>
          </Flex>
        }
        condition={false}
        withBorder
      ></PageWrapper>
    </>
  );
}

export default Page;
