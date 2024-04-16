'use client';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
// import { ExpandableTable } from './table';
import 'mantine-datatable/styles.layer.css';
import PageWrapper from '@/app/(features)/vendor/_components/page-wrapper';
import EmptyDataPlaceholder from '@/app/(features)/vendor/_components/empty-data-placeholder';

const badgeBGColor: { [key: string]: string } = {
  Rejected: `red.0`,
  Submitted: `blue.0`,
  Adjustment: `yellow.0`,
  Completed: `green.0`,
  Pending: `blue.0`,
  Outdated: `orange.0`,
};
const badgeTextColor: { [key: string]: string } = {
  Rejected: `red.6`,
  Submitted: `blue.6`,
  Adjustment: `yellow.6`,
  Completed: `green.6`,
  Pending: `blue.6`,
  Outdated: `orange.6`,
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ApplicationList = () => {
  return (
    <PageWrapper
      title="Track Application"
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
    >
      <EmptyDataPlaceholder />
    </PageWrapper>
  );
};
export default ApplicationList;
