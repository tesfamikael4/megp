'use client';
import { Flex, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';

const perPage = 10;

interface Config {
  columns: any[];
  isExpandable?: boolean;
  expandedRowContent?: (record: any) => React.ReactNode;
  isSearchable?: boolean;
  primaryColumn?: string;
  isLoading?: boolean;
}

export const ExpandableTable = ({
  config,
  data,
  onRequestChange,
  total = 0,
}: {
  config: Config;
  data: any[];
  onRequestChange?: (request) => void;
  total?: number;
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const from = (page - 1) * perPage;
    onRequestChange?.({
      skip: from,
      take: perPage,
      where: search
        ? [
            [
              {
                column: config.primaryColumn ?? 'description',
                value: search,
                operator: 'ILIKE',
              },
            ],
          ]
        : [],
    });
  }, [page, search]);
  return (
    <>
      {config.isSearchable && (
        <Flex justify="end" className="my-2">
          <TextInput
            leftSection={<IconSearch size={14} />}
            placeholder="Search"
            value={search}
            size="xs"
            onChange={(e) => setSearch(e.target.value)}
            miw={300}
          />
        </Flex>
      )}
      <DataTable
        striped
        highlightOnHover
        columns={config.columns}
        records={data}
        rowExpansion={{
          trigger: config.isExpandable ? 'click' : 'never',
          content: ({ record }: any) =>
            config.expandedRowContent
              ? config.expandedRowContent(record)
              : null,
        }}
        styles={{
          header: {
            backgroundColor: 'rgb(209 213 219)',
          },
        }}
        page={page}
        totalRecords={total}
        recordsPerPage={perPage}
        onPageChange={setPage}
        defaultColumnRender={(record, _, accessor) => (
          <p className="line-clamp-2">{record[accessor]}</p>
        )}
        fetching={config.isLoading}
        minHeight={300}
        noRecordsText="No data found"
      />
    </>
  );
};
