'use client';

import { useLazyGetDifQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';
import { ActionIcon, Box, Modal } from '@mantine/core';
import { ExpandableTable, ExpandableTableConfig, Section } from '@megp/core-fe';
import { IconChevronRight } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Compare } from './_components/compare';

export default function History() {
  const { toBeCompare, comparedWith } = useParams();
  const [getDif, { data }] = useLazyGetDifQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const config: ExpandableTableConfig = {
    minHeight: 100,
    columns: [
      {
        accessor: 'procurementReference',
        title: '#Ref',
        width: 100,
      },
      {
        accessor: 'name',
        width: 200,
      },
      {
        accessor: 'description',
        width: 400,
      },
      {
        accessor: 'estimatedAmount',
        title: 'Total Amount',
        width: 200,
        render: (activity) => (
          <>
            {parseFloat(activity.estimatedAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: 'MKW',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currencyDisplay: 'code',
            })}
          </>
        ),
      },
    ],
  };

  useEffect(() => {
    getDif({
      toBeCompare: toBeCompare,
      comparedWith: comparedWith,
    });
  }, [getDif, toBeCompare, comparedWith]);
  return (
    <Box>
      {data?.addedKeys?.length > 0 && (
        <Section title="New added Activities" className="mt-2">
          <ExpandableTable data={data?.addedKeys ?? []} config={config} />
        </Section>
      )}
      {data?.modifiedKeys?.length > 0 && (
        <Section
          title="Modified Activities"
          className="mt-2"
          defaultCollapsed={data?.addedKeys?.length > 0}
        >
          <ExpandableTable
            data={data?.modifiedKeys ?? []}
            config={{
              ...config,
              columns: [
                ...config.columns,
                {
                  accessor: 'action',
                  title: '',
                  width: 50,
                  render: (record) => (
                    <ActionIcon
                      variant="subtle"
                      onClick={() => setSelectedId(record.id)}
                    >
                      <IconChevronRight size={14} />
                    </ActionIcon>
                  ),
                },
              ],
            }}
          />
        </Section>
      )}
      {data?.removedKeys?.length > 0 && (
        <Section
          title="Deleted Activities"
          className="mt-2"
          defaultCollapsed={
            data?.addedKeys?.length > 0 || data?.modifiedKeys?.length > 0
          }
        >
          <ExpandableTable data={data?.removedKeys ?? []} config={config} />
        </Section>
      )}

      <Modal
        opened={selectedId !== null}
        onClose={() => setSelectedId(null)}
        fullScreen
      >
        {selectedId && <Compare activityId={selectedId} />}
      </Modal>
    </Box>
  );
}
