'use client';
import React, { useEffect, useState } from 'react';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import { DataTable } from 'mantine-datatable';
import { IconChevronRight } from '@tabler/icons-react';
import { Box, Checkbox } from '@mantine/core';
import clsx from 'clsx';
import type {
  ChildNodeProps,
  NestedDataTableProps,
  TDataWithChildren,
  TreeProps,
} from './models';
import classes from './Tree.module.css';

export function Root<TData>({
  records,
  expandedRecordIds,
  onExpandedRecordIdsChange,
  config,
}: NestedDataTableProps<TData>): React.ReactNode {
  const {
    id: accessor,
    label,
    selectable,
    multipleSelect,
    setSelectedIds,
    selectedIds,
    selectOnlyLeafs,
    backgroundColor,
    multipleExpand,
  } = config;

  const [manipulatedData, setManipulatedData] =
    useState<TDataWithChildren<TData>[]>(records);
  useEffect(() => {
    setManipulatedData(records);
  }, [records.length]);
  const [clicked, setClicked] = useState<string | null>(null);

  const render = ({ record }) => (
    <Child
      clicked={clicked}
      config={{ ...config }}
      data={record}
      expandedRecordIds={expandedRecordIds}
      id={record[accessor]}
      level={2}
      manipulatedData={manipulatedData}
      onExpandedRecordIdsChange={onExpandedRecordIdsChange}
      setClicked={setClicked}
      setManipulatedData={setManipulatedData}
    />
  );

  return (
    <DataTable
      backgroundColor={backgroundColor}
      columns={[
        {
          accessor: 'name',
          title: '',
          ellipsis: true,
          width: 100,
          render: (data: TDataWithChildren<TData>) => {
            const id: string = data[accessor] as string;
            return (
              <Box component="span" ml={0}>
                <IconChevronRight
                  className={clsx(classes.icon, classes.expandIcon, {
                    [classes.expandIconRotated]: expandedRecordIds.includes(id),
                  })}
                  onClick={() => {
                    if (
                      selectOnlyLeafs &&
                      data.children?.length === 0 &&
                      setSelectedIds &&
                      selectedIds
                    )
                      setSelectedIds(
                        selectedIds.filter((selectedId) => selectedId !== id),
                      );

                    if (expandedRecordIds.includes(id)) {
                      onExpandedRecordIdsChange(
                        expandedRecordIds.filter(
                          (expandedId) => expandedId !== id,
                        ),
                      );
                    } else {
                      onExpandedRecordIdsChange([...expandedRecordIds, id]);
                    }
                  }}
                />

                {selectable && multipleSelect ? (
                  <span>
                    {!selectOnlyLeafs || data.children?.length === 0 ? (
                      <Checkbox
                        className={clsx(classes.icon)}
                        onClick={() => {
                          if (setSelectedIds && selectedIds) {
                            if (selectedIds.includes(id)) {
                              setSelectedIds(
                                selectedIds.filter(
                                  (selectedId) => selectedId !== id,
                                ),
                              );
                            }
                            setSelectedIds([...selectedIds, id]);
                          }
                        }}
                        size="xs"
                        style={{
                          display: 'inline-block',
                          marginTop: '2px',
                          marginInline: '8px',
                        }}
                      />
                    ) : null}
                  </span>
                ) : null}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setClicked((prev) => (prev === id ? null : id));

                    if (!multipleSelect && setSelectedIds) {
                      if (selectedIds?.includes(id)) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds([id] as string[]);
                      }
                    }
                    if (config.onClick) {
                      config.onClick(data);
                    }
                  }}
                  onKeyDown={() => {
                    return null;
                  }}
                  role="presentation"
                >
                  {data[label] as React.ReactNode}
                </span>
              </Box>
            );
          },
        },
      ]}
      highlightOnHover
      noHeader
      noRecordsIcon
      noRecordsText=""
      records={manipulatedData}
      rowExpansion={{
        allowMultiple: multipleExpand,
        expanded: {
          recordIds: expandedRecordIds,
          onRecordIdsChange: onExpandedRecordIdsChange,
        },
        trigger: 'never',
        content: render,
      }}
      rowStyle={(row) => {
        return {
          backgroundColor: row[accessor] === clicked ? 'lightgray' : '',
        };
      }}
      scrollAreaProps={{ scrollbars: 'y' }}
      selectionTrigger="checkbox"
    />
  );
}

function Child<TData>({
  id,
  expandedRecordIds,
  onExpandedRecordIdsChange,
  level = 0,
  data,
  setManipulatedData,
  manipulatedData,
  config,
  clicked,
  setClicked,
}: ChildNodeProps<TData>): React.ReactNode {
  const [loading, setLoading] = useState(false);
  const { id: accessor, label, setSelectedIds, selectedIds } = config;

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (config.load) {
        await config
          .load(data)
          .then(({ result, loading: _loading }) => {
            setLoading(_loading);
            const updatedData = updateChildren(manipulatedData, id, result);
            setManipulatedData(updatedData);
          })
          .catch((error: string | undefined) => {
            throw new Error(error);
          });
      }
    };

    void fetchData();
  }, [data[id]]);

  const updateChildren = (
    children: (TData & { children?: TDataWithChildren<TData>[] })[],
    targetId: string,
    newChildren: TDataWithChildren<TData>[],
  ): TDataWithChildren<TData>[] => {
    return children.map((child) => {
      if (child[accessor] === targetId) {
        return { ...child, children: newChildren };
      } else if (child.children) {
        return {
          ...child,
          children: updateChildren(child.children, targetId, newChildren),
        };
      }
      return child;
    });
  };

  const render = ({ record }) => (
    <Child
      clicked={clicked}
      config={config}
      data={record}
      expandedRecordIds={expandedRecordIds}
      id={record[accessor]}
      level={level + 1}
      manipulatedData={manipulatedData}
      onExpandedRecordIdsChange={onExpandedRecordIdsChange}
      setClicked={setClicked}
      setManipulatedData={setManipulatedData}
    />
  );

  return (
    <DataTable
      backgroundColor={config.backgroundColor}
      columns={[
        {
          accessor: label,
          ellipsis: true,
          width: 100,
          title: '',
          render: (record: TDataWithChildren<TData>) => {
            const unique: string = record[accessor] as string;
            return (
              <Box component="span" ml={20 * level}>
                <IconChevronRight
                  className={clsx(classes.icon, classes.expandIcon, {
                    [classes.expandIconRotated]:
                      expandedRecordIds.includes(unique),
                  })}
                  onClick={() => {
                    if (
                      config.selectOnlyLeafs &&
                      record.children?.length === 0 &&
                      setSelectedIds &&
                      selectedIds
                    )
                      setSelectedIds(
                        selectedIds.filter(
                          (selectedId) => selectedId !== unique,
                        ),
                      );

                    if (expandedRecordIds.includes(id)) {
                      onExpandedRecordIdsChange(
                        expandedRecordIds.filter(
                          (expandedId) => expandedId !== unique,
                        ),
                      );
                    } else {
                      onExpandedRecordIdsChange([...expandedRecordIds, unique]);
                    }
                  }}
                />
                {config.multipleSelect ? (
                  <span>
                    {config.selectable &&
                    (!config.selectOnlyLeafs ||
                      record.children?.length === 0) ? (
                      <Checkbox
                        onClick={() => {
                          if (setSelectedIds && selectedIds) {
                            if (selectedIds.includes(id)) {
                              setSelectedIds(
                                selectedIds.filter(
                                  (selectedId) => selectedId !== unique,
                                ),
                              );
                            } else {
                              setSelectedIds([...selectedIds, id]);
                            }
                          }
                        }}
                        size="xs"
                        style={{
                          display: 'inline-block',
                          marginTop: '4px',
                          marginInline: '8px',
                        }}
                      />
                    ) : null}
                  </span>
                ) : null}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setClicked((prev) => (prev === unique ? null : unique));
                    if (!config.multipleSelect && setSelectedIds) {
                      if (selectedIds?.includes(unique)) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds([unique] as string[]);
                      }
                    }
                    if (config.onClick) {
                      config.onClick(record);
                    }
                  }}
                  onKeyDown={() => {
                    return null;
                  }}
                  role="presentation"
                >
                  {record[label] as React.ReactNode}
                </span>
              </Box>
            );
          },
        },
      ]}
      fetching={loading}
      minHeight={
        (!data.children || data.children.length === 0) && !config.load ? 0 : 100
      }
      noHeader
      noRecordsIcon
      noRecordsText=""
      records={data.children}
      rowExpansion={{
        allowMultiple: config.multipleExpand,
        trigger: 'never',
        expanded: {
          recordIds: expandedRecordIds,
          onRecordIdsChange: (recordedIds: string[]) => {
            onExpandedRecordIdsChange(recordedIds);
          },
        },
        content: render,
      }}
      rowStyle={(row) => {
        return {
          backgroundColor: row[accessor] === clicked ? 'lightgray' : '',
        };
      }}
      selectionTrigger="checkbox"
      // withColumnBorders
    />
  );
}

export function MantineTree<TData>({
  data,
  config,
}: TreeProps<TData>): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  return (
    <Root
      config={config}
      expandedRecordIds={expandedIds}
      onExpandedRecordIdsChange={setExpandedIds}
      records={data}
    />
  );
}
