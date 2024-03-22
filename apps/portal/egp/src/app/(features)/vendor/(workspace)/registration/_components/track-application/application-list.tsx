'use client';
import { Badge, Box, TextInput } from '@mantine/core';
import { useState, type FC } from 'react';
import { StatsListCard } from './stats-card';
import { useGetApplicationListQuery } from '../../_api/query';
import styles from './application-list.module.scss';
import DetailViewCard from './detail-view-card';
import { useDisclosure } from '@mantine/hooks';
import { ApplicationInfo } from '@/models/vendorRegistration';
import { IconSearch } from '@tabler/icons-react';
// import { ExpandableTable } from './table';
import 'mantine-datatable/styles.layer.css';
import { ExpandableTable } from '@megp/core-fe';
import { formatDateTimeFromString } from '../review/utils';
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
  const [selectData, setSelectData] = useState<ApplicationInfo | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const requestInfo = useGetApplicationListQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const handleDetailClose = () => {
    close();
    setSelectData(null);
  };

  const config = {
    columns: [
      {
        accessor: 'service',
        title: 'Service Name',
      },

      { accessor: 'ApplicationNumber', title: 'Application No.' },
      {
        accessor: 'submittedAt',
        title: 'Submitted At',
        render: (val) => {
          return formatDateTimeFromString(val.submittedAt);
        },
      },
      {
        accessor: 'status',
        title: 'Status',
        render: (val) => {
          return (
            <Badge
              size="xs"
              color={badgeBGColor[val.status]}
              className={`rounded-none flex items-center p-1.5 ${val.status === 'Adjustment' && 'animate-bounce'}`}
            >
              <Box c={badgeTextColor[val.status]}>{val.status}</Box>
            </Badge>
          );
        },
      },
    ],
    isExpandable: true,
    expandedRowContent: (record, collapse) => {
      if (record.status === 'Adjustment')
        return (
          <DetailViewCard
            data={record}
            close={() => {
              handleDetailClose();
            }}
          />
        );
      return <></>;
    },
  };

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
      headerBorder
      condition={requestInfo.data && requestInfo.data.length > 0}
      isLoading={requestInfo.isLoading}
    >
      {requestInfo.data && requestInfo.data.length > 0 ? (
        <Box className={styles.mainGrid}>
          <Box className={`w-full`}>
            <ExpandableTable
              config={config}
              data={requestInfo.data ?? []}
              total={requestInfo.data.length ?? 0}
            />
          </Box>
          {opened && selectData && (
            <Box className={styles.detail}>
              <DetailViewCard data={selectData} close={handleDetailClose} />
            </Box>
          )}
        </Box>
      ) : (
        <EmptyDataPlaceholder />
      )}
    </PageWrapper>
  );
};
export default ApplicationList;
