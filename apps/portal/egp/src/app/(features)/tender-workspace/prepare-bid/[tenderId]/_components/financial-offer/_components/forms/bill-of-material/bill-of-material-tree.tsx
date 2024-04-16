'use client';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useState } from 'react';
import { BillOfMaterial } from '@/models/tender/lot/item/bill-of-material.model';
import { NumberInput } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useFormContext } from 'react-hook-form';
interface BOQ extends BillOfMaterial {
  children: BOQ[];
}
export function BillOfMaterialTreeTable({
  boq,
}: {
  boq: BOQ[];
}): React.ReactNode {
  const {
    formState: { errors },
    reset,
    register,
    control,
  } = useFormContext();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const render = (record) => (
    <NodeTree childrenScoring={record.children} padding={10} />
  );

  return (
    <>
      <DataTable
        withColumnBorders
        highlightOnHover
        columns={[
          {
            accessor: 'description',
            title: 'Description',
            width: 300,
            noWrap: true,
            render: (record) => (
              <>
                <div className="flex">
                  <div>
                    {record.children?.length > 0 &&
                    expandedIds.includes(record.id) ? (
                      <IconChevronDown size={20} />
                    ) : (
                      <IconChevronRight size={20} />
                    )}
                  </div>
                  <span className="whitespace-pre-line">
                    {record.description}
                  </span>
                </div>
              </>
            ),
          },
          {
            accessor: 'unit',
            title: 'Unit of measure',
            width: 200,
          },
          {
            accessor: 'quantity',
            title: 'Quantity',
            width: 200,
          },
          {
            accessor: 'unitRate',
            title: 'Unit Rate',
            render: (record) => (
              <>
                {record.children?.length === 0 && <NumberInput withAsterisk />}
              </>
            ),
            width: 200,
          },
        ]}
        records={boq}
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedIds,
            onRecordIdsChange: setExpandedIds,
          },
          content: ({ record }) => (
            <>
              {boq.filter((s) => s.parentCode === record.code).length > 0
                ? render(record)
                : null}
            </>
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
  childrenScoring: BOQ[];
  padding: number;
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const render = (record: BOQ) => {
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
            width: 300,
            noWrap: true,
            render: (record: BOQ) => (
              <>
                <div className={`flex pl-${padding}`}>
                  <div>
                    {record.children?.length > 0 &&
                    expandedIds.includes(record.id) ? (
                      <IconChevronDown size={20} />
                    ) : (
                      <IconChevronRight size={20} />
                    )}
                  </div>
                  <span className="whitespace-pre-line">
                    {record.description}
                  </span>
                </div>
              </>
            ),
          },
          {
            accessor: 'unit',
            title: 'Unit of measure',
            width: 200,
          },
          {
            accessor: 'quantity',
            title: 'Quantity',
            width: 200,
          },
          {
            accessor: 'unitRate',
            title: 'Unit Rate',
            render: (record) => (
              <>
                {record.children?.length === 0 && <NumberInput withAsterisk />}
              </>
            ),
            width: 200,
          },
        ]}
        records={childrenScoring}
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedIds,
            onRecordIdsChange: setExpandedIds,
          },
          content: ({ record, collapse }: any) =>
            record.children?.length > 0 ? <>{render(record)}</> : null,
        }}
      />
    </>
  );
}
