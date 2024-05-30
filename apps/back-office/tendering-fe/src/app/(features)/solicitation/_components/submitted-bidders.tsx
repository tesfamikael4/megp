'use client';
import { Badge, Text } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { useLazyGetSubmittedBiddersQuery } from '../_api/submitted-bidders.api';
import { useParams } from 'next/navigation';

export default function SubmittedBidders() {
  const [trigger, { data, isFetching }] = useLazyGetSubmittedBiddersQuery();
  const { tenderId } = useParams();
  const config = {
    columns: [
      {
        accessor: 'bidderName',
        title: 'Vendor Name',
        width: 200,
        render: ({ status }: any) => <Text>*** ***</Text>,
      },

      {
        accessor: 'status',

        width: 150,
        render: ({ status }: any) => (
          <Badge
            color={
              status === 'SUBMITTED'
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
    ],
    isExpandable: true,
    isSearchable: true,
    primaryColumn: 'title',
    isFetching: isFetching,
  };
  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      tenderId: tenderId.toString(),
      collectionQuery: {
        ...request,
      },
    });
  };
  return (
    <>
      <Section title="Submitted Bidders" collapsible={false} className="mt-2">
        <ExpandableTable
          config={config}
          data={data?.items ?? []}
          total={data?.total ?? 0}
          onRequestChange={onRequestChange}
        />
      </Section>
    </>
  );
}
