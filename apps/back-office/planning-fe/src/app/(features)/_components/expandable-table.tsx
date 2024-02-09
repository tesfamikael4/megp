'use client';
import { Flex, TextInput } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { IconInboxOff, IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';

const perPage = 10;

interface Config {
  idAccessor?: string;
  columns: any[];
  isExpandable?: boolean;
  expandedRowContent?: (record: any, collapse?: any) => React.ReactNode;
  isSearchable?: boolean;
  primaryColumn?: string;
  isSelectable?: boolean;
  disableMultiSelect?: boolean;
  selectedItems?: any[];
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
  const [sortStatus, setSortStatus] = useState<any>({});

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
      orderBy: sortStatus?.columnAccessor
        ? [
            {
              column: sortStatus?.columnAccessor,
              direction: sortStatus?.direction?.toUpperCase(),
            },
          ]
        : [],
    });
  }, [page, search, sortStatus]);
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
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
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
        page={total ? page : 0}
        totalRecords={total}
        recordsPerPage={perPage}
        onPageChange={setPage}
        noRecordsIcon={<IconInboxOff size={40} />}
        noRecordsText="No Data Found"
        defaultColumnRender={(record, _, accessor) => (
          <p className="line-clamp-2">{record[accessor]}</p>
        )}
        selectedRecords={config.selectedItems}
        onSelectedRecordsChange={(records) => {
          logger.log({ records });
          if (config.disableMultiSelect) {
            const temp = records.filter(
              (r) => !config.selectedItems?.includes(r),
            );
            config.setSelectedItems && config.setSelectedItems(temp);
          } else config.setSelectedItems && config.setSelectedItems(records);
        }}
        allRecordsSelectionCheckboxProps={{
          display: config.disableMultiSelect ? 'none' : 'block',
        }}
        selectionCheckboxProps={{
          radius: config.disableMultiSelect ? 'xl' : 'sm',
        }}
        idAccessor={config.idAccessor ?? 'id'}
      />
    </>
  );
};
