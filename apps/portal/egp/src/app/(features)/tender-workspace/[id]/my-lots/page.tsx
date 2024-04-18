'use client';
import { useLazyGetLotsQuery } from '@/app/(features)/_api/registration.api';
import { ActionIcon, Badge, Box, Flex, Text } from '@mantine/core';
import { ExpandableTable } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
const MyLotsPage = () => {
  const [trigger, { data, isFetching }] = useLazyGetLotsQuery();
  const { lotId } = useParams();
  const router = useRouter();
  const { id } = useParams();
  const config = {
    columns: [
      {
        accessor: 'name',
        title: 'Lot Name',
        render: (bookmark) => <Text>{bookmark.name}</Text>,
      },
      {
        accessor: 'number',
        title: 'Number',
        render: (bookmark) => <Text>{bookmark.number}</Text>,
      },
      {
        accessor: 'status',

        render: ({ status }: any) => (
          <Badge
            color={
              status === 'APPROVED'
                ? 'green'
                : status === 'DRAFT'
                  ? 'yellow'
                  : 'red'
            }
            variant="light"
            fw={700}
            radius={'sm'}
          >
            {status}
          </Badge>
        ),
      },

      {
        accessor: '',
        render: (record) => (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/tender-workspace/${id}/my-lots/${record?.id}/guarantee`,
              );
            }}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        ),
        width: 100,
      },
    ],

    isSearchable: true,
    isFetching: isFetching,
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({ id: id.toString(), collectionQuery: request });
  };

  return (
    <>
      <Box className="p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-4 border-b-2">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              My Lots
            </Text>
          </Flex>
          <ExpandableTable
            config={config}
            data={data?.items ?? []}
            total={data?.total ?? 0}
            onRequestChange={onRequestChange}
          />
        </Box>
      </Box>
    </>
  );
};

export default MyLotsPage;
