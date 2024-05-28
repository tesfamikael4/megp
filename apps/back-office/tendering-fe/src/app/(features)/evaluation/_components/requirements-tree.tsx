'use client';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useState } from 'react';

export function RequirementsTree({
  requirements,
}: {
  requirements: any[];
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const render = (record) => (
    <NodeTree childrenScoring={record.children} padding={20} />
  );

  return (
    <>
      <DataTable
        withColumnBorders
        highlightOnHover
        noHeader
        columns={[
          {
            accessor: 'description',
            noWrap: true,
            render: (record) => (
              <>
                <div className="flex">
                  {record.children?.length > 0 && (
                    <div>
                      {expandedIds.includes(record.id) ? (
                        <IconChevronDown size={20} />
                      ) : (
                        <IconChevronRight size={20} />
                      )}
                    </div>
                  )}
                  <span className="whitespace-pre-line">
                    {record.description}
                  </span>
                </div>
              </>
            ),
          },
        ]}
        records={requirements}
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedIds,
            onRecordIdsChange: (record) => {
              if (record.length > 0) {
                const newlyAdded = record.filter(
                  (single) => !expandedIds.find((rec) => rec === single),
                );
                const child = requirements.find(
                  (child) => child.id === newlyAdded[0],
                );
                if (child) {
                  child?.children?.length > 0 ? setExpandedIds(record) : null;
                } else {
                  setExpandedIds(record);
                }
              } else {
                setExpandedIds(record);
              }
            },
          },
          content: ({ record }) => (
            <>{record.children?.length > 0 ? render(record) : null}</>
          ),
        }}
      />
    </>
  );
}

export function NodeTree({
  childrenScoring,
  padding,
}: {
  childrenScoring: any[];
  padding: number;
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const render = (record: any) => {
    return (
      <NodeTree childrenScoring={record.children} padding={20 + padding} />
    );
  };

  return (
    <>
      <DataTable
        noHeader
        withColumnBorders
        columns={[
          {
            accessor: 'description',
            title: 'Description',
            noWrap: true,
            render: (record: any) => (
              <>
                <div className={`flex pl-[${padding}px]`}>
                  {record.children?.length > 0 && (
                    <div>
                      {expandedIds.includes(record.id) ? (
                        <IconChevronDown size={20} />
                      ) : (
                        <IconChevronRight size={20} />
                      )}
                    </div>
                  )}
                  <span className="whitespace-pre-line ">
                    {record.description}
                  </span>
                </div>
              </>
            ),
          },
        ]}
        records={childrenScoring}
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedIds,
            onRecordIdsChange: (record) => {
              if (record.length > 0) {
                const newlyAdded = record.filter(
                  (single) => !expandedIds.find((rec) => rec === single),
                );
                const child = childrenScoring.find(
                  (child) => child.id === newlyAdded[0],
                );
                if (child) {
                  child?.children?.length > 0 ? setExpandedIds(record) : null;
                } else {
                  setExpandedIds(record);
                }
              } else {
                setExpandedIds(record);
              }
            },
          },
          content: ({ record }: any) =>
            record.children?.length > 0 ? <>{render(record)}</> : null,
        }}
      />
    </>
  );
}
