'use client';
import {
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export function RequirementsTree({
  requirements,
}: {
  requirements: any[];
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const { bidderId, tenderId, lotId } = useParams();
  const render = (record) => (
    <NodeTree childrenScoring={record.children} padding={20} />
  );

  return (
    <>
      <DataTable
        // withColumnBorders
        highlightOnHover
        noHeader
        columns={[
          {
            accessor: 'requirement',
            noWrap: true,
            render: (record) => (
              <>
                {record?.children?.length > 0 && (
                  <div className="flex">
                    <div>
                      {expandedIds.includes(record.id) ? (
                        <IconChevronDown size={20} />
                      ) : (
                        <IconChevronRight size={20} />
                      )}
                    </div>
                    <span className="whitespace-pre-line text-sm">
                      {record?.requirement}
                    </span>
                  </div>
                )}
                {record?.children?.length == 0 && (
                  <Link
                    href={`/evaluation/${tenderId}/${lotId}/scoring/${bidderId}/${record.id}`}
                  >
                    <span className="whitespace-pre-line text-sm">
                      {record?.requirement}
                    </span>
                  </Link>
                )}
                {record.check ? (
                  <p className="text-xs text-right text-green-500 font-semibold mt-2">
                    <span className="text-black">Awarded Score :</span>
                    {record.awardedPoints}/{record.point}
                  </p>
                ) : (
                  <p className="text-xs text-right text-red-500 font-semibold mt-2">
                    Not Assessed
                  </p>
                )}
              </>
            ),
          },
          // {
          //   accessor: 'awardedPoints',
          //   // render: (record) => `${record.awardedPoints}/${record.point}`,
          //   // accessor: 'check',
          //   // render: (record) =>
          //   //   record.check ? (
          //   //     <IconCircleCheck size={18} color="green" />
          //   //   ) : (
          //   //     <IconAlertCircle size={18} color="red" />
          //   //   ),
          // },
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
  const { bidderId, tenderId, lotId } = useParams();
  const render = (record: any) => {
    return (
      <NodeTree childrenScoring={record.children} padding={20 + padding} />
    );
  };

  return (
    <>
      <DataTable
        noHeader
        columns={[
          {
            accessor: 'requirement',
            noWrap: true,
            render: (record: any) => (
              <>
                {record.children?.length > 0 && (
                  <div
                    className={`flex`}
                    style={{ paddingLeft: `${padding}px` }}
                  >
                    <div>
                      {expandedIds.includes(record.id) ? (
                        <IconChevronDown size={20} />
                      ) : (
                        <IconChevronRight size={20} />
                      )}
                    </div>
                    <span className="whitespace-pre-line text-sm">
                      {record.requirement}
                    </span>
                  </div>
                )}
                {record.children?.length == 0 && (
                  <div
                    className={`flex`}
                    style={{ paddingLeft: `${padding}px` }}
                  >
                    <Link
                      href={`/evaluation/${tenderId}/${lotId}/scoring/${bidderId}/${record.id}`}
                    >
                      <span className="whitespace-pre-line text-sm">
                        {record.requirement}
                      </span>
                    </Link>
                  </div>
                )}
                {record.check ? (
                  <p className="text-xs text-right text-green-500 font-semibold mt-2">
                    <span className="text-black">Awarded Score :</span>
                    {record.awardedPoints}/{record.point}
                  </p>
                ) : (
                  <p className="text-xs text-right text-red-500 font-semibold mt-2">
                    Not Assessed
                  </p>
                )}
              </>
            ),
          },
          // {
          //   accessor: 'check',
          //   render: (record) =>
          //     record.check ? (
          //       <IconCircleCheck size={18} color="green" />
          //     ) : (
          //       <IconAlertCircle size={18} color="red" />
          //     ),
          // },
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
