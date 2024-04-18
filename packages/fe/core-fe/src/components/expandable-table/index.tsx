'use client';
import { Flex, TextInput } from '@mantine/core';
import { IconInboxOff, IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { type ReactElement, useEffect, useState } from 'react';
import { type ExpandableTableConfig } from './models';
// import classes from './table.module.scss';

const perPage = 10;

export function ExpandableTable({
  config,
  data,
  onRequestChange,
  total,
}: {
  config: ExpandableTableConfig;
  data: any[];
  onRequestChange?: (request) => void;
  total?: number;
}): ReactElement {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<any>({});

  const defaultColumnRender = (record, _, accessor) => (
    <p className="line-clamp-2">{record[accessor]}</p>
  );

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
  const paginationProps = total
    ? {
        page,
        onPageChange: setPage,
        recordsPerPage: perPage,
        totalRecords: total,
      }
    : {};
  return (
    <>
      {config.isSearchable ? (
        <Flex className="my-2" justify="space-between">
          {config.action ? config.action : <div />}
          <TextInput
            leftSection={<IconSearch size={14} />}
            miw={300}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
            size="xs"
            value={search}
            // width={300}
          />
        </Flex>
      ) : null}
      <DataTable
        allRecordsSelectionCheckboxProps={{
          display: config.disableMultiSelect ? 'none' : 'block',
        }}
        columns={config.columns}
        defaultColumnRender={defaultColumnRender}
        highlightOnHover
        idAccessor={config.idAccessor ?? 'id'}
        minHeight={config.minHeight ?? 300}
        noRecordsIcon={<IconInboxOff size={40} />}
        noRecordsText={config.noRecordsText ?? 'No Data Found'}
        rowExpansion={{
          trigger: config.isExpandable ? 'click' : 'never',
          content: ({ record, collapse }: any) =>
            config.expandedRowContent
              ? config.expandedRowContent(record, collapse)
              : null,
        }}
        selectedRecords={config.selectedItems}
        selectionCheckboxProps={{
          radius: config.disableMultiSelect ? 'xl' : 'sm',
        }}
        sortStatus={sortStatus}
        striped
        withTableBorder
        {...paginationProps}
        // classNames={{ table: classes.table, header: classes.header }}
        fetching={config.isLoading}
        onRowClick={config.onClick ?? undefined}
        onSelectedRecordsChange={(records) => {
          if (config.disableMultiSelect) {
            const temp = records.filter(
              (r) => !config.selectedItems?.includes(r),
            );
            config.setSelectedItems && config.setSelectedItems(temp);
          } else config.setSelectedItems && config.setSelectedItems(records);
        }}
        onSortStatusChange={setSortStatus}
        records={data}
        styles={{
          header: {
            backgroundColor: '#D9D9D9',
          },
        }}
      />
    </>
  );
}
