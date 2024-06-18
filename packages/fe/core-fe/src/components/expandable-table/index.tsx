'use client';
import { Flex, TextInput, Box, Menu, Tooltip } from '@mantine/core';
import { IconInboxOff, IconSearch, IconFilter } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { type ReactElement, useEffect, useState } from 'react';
import React from 'react';
import { type ExpandableTableConfig } from './models';

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
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >(
    () =>
      config.filters?.reduce(
        (acc, filter) => {
          acc[filter.accessor] = [];
          return acc;
        },
        {} as Record<string, string[]>,
      ) || {},
  );

  const defaultColumnRender = (record, _, accessor) => (
    <p className="line-clamp-2">{record[accessor]}</p>
  );

  const handleItemClick = (filterAccessor: string, itemKey: string) => {
    setSelectedFilters((prev) => {
      const filters = { ...prev };
      if (filters[filterAccessor].includes(itemKey)) {
        filters[filterAccessor] = filters[filterAccessor].filter(
          (key) => key !== itemKey,
        );
      } else {
        filters[filterAccessor].push(itemKey);
      }
      return filters;
    });
  };

  useEffect(() => {
    const from = (page - 1) * perPage;
    const where = search
      ? [
          [
            {
              column: config.primaryColumn ?? 'description',
              value: search,
              operator: 'ILIKE',
            },
          ],
        ]
      : [];

    for (const [accessor, keys] of Object.entries(selectedFilters)) {
      if (keys.length > 0) {
        where.push(
          keys.map((key) => ({
            column: accessor,
            value: key,
            operator: '=',
          })),
        );
      }
    }

    onRequestChange?.({
      skip: from,
      take: perPage,
      where,
      orderBy: sortStatus?.columnAccessor
        ? [
            {
              column: sortStatus?.columnAccessor,
              direction: sortStatus?.direction?.toUpperCase(),
            },
          ]
        : [],
    });
  }, [page, search, sortStatus, selectedFilters]);

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
          {config.filters ? (
            <Box className="ml-auto mr-2 mt-2">
              <Menu position="right-start" shadow="md" width={400}>
                <Menu.Target>
                  <Tooltip label="Filter">
                    <IconFilter size={17} />
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  {config.filters.map((filter, index) => (
                    <React.Fragment key={index}>
                      <Menu.Label>{filter.label}</Menu.Label>
                      {filter.items.map((item, idx) => (
                        <div className="flex items-center" key={idx}>
                          <Flex
                            className="items-center cursor-pointer pl-4"
                            onClick={() => {
                              handleItemClick(
                                filter.accessor as string,
                                item.key as string,
                              );
                            }}
                          >
                            {selectedFilters[filter.accessor].includes(
                              item.key as string,
                            ) ? (
                              <span className="text-green-600 text-base">
                                {item.value}
                              </span>
                            ) : (
                              <span className="text-base">{item.value}</span>
                            )}
                          </Flex>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Box>
          ) : null}
          <TextInput
            leftSection={<IconSearch size={14} />}
            miw={300}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
            size="xs"
            value={search}
          />
        </Flex>
      ) : null}
      <DataTable
        allRecordsSelectionCheckboxProps={{
          display: config.disableMultiSelect ? 'none' : 'block',
        }}
        columns={config.columns}
        defaultColumnRender={defaultColumnRender}
        height="auto"
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
