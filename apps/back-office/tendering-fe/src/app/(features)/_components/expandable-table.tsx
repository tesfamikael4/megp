'use client';
import { Flex, TextInput } from '@mantine/core';
import { IconInboxOff, IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';

const perPage = 10;

interface Config {
  columns: any[];
  isExpandable?: boolean;
  expandedRowContent?: (record: any, collapse?: any) => React.ReactNode;
  isSearchable?: boolean;
  primaryColumn?: string;
  isSelectable?: boolean;
  selectedItems?: any[];
  isLoading?: boolean;
  setSelectedItems?: (items: any[]) => void;
}

export const ExpandableTable = ({
  config,
  data,
  onRequestChange,
  total,
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
            // width={300}
            miw={300}
          />
        </Flex>
      )}
      <DataTable
        minHeight={300}
        striped
        highlightOnHover
        columns={config.columns}
        records={data}
        rowExpansion={{
          trigger: config.isExpandable ? 'click' : 'never',
          content: ({ record, collapse }: any) =>
            config.expandedRowContent
              ? config.expandedRowContent(record, collapse)
              : null,
        }}
        styles={{
          header: {
            backgroundColor: '#D9D9D9',
          },
        }}
        page={page}
        totalRecords={total}
        recordsPerPage={perPage}
        onPageChange={setPage}
        noRecordsIcon={<IconInboxOff size={40} />}
        noRecordsText="No Data Found"
        defaultColumnRender={(record, _, accessor) => (
          <p className="line-clamp-2">{record[accessor]}</p>
        )}
        selectedRecords={config.selectedItems}
        onSelectedRecordsChange={config.setSelectedItems}
        fetching={config.isLoading}
      />
    </>
  );
};
