'use client';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useState } from 'react';
import { BillOfMaterial } from '@/models/tender/lot/item/bill-of-material.model';
import { NumberInput } from '@mantine/core';

export function BillOfMaterialTreeTable({
  boq,
}: {
  boq: BillOfMaterial[];
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const render = ({ record }) => (
    <NodeTree
      childrenScoring={boq.filter((s) => s.parentCode === record.code)}
      boq={boq}
      padding={10}
    />
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
            render: ({ id, description }) => (
              <>
                <div className="flex">
                  <div>
                    {expandedIds.includes(id) ? (
                      <IconChevronDown size={20} />
                    ) : (
                      <IconChevronRight size={20} />
                    )}
                  </div>
                  <span className="whitespace-pre-line">{description}</span>
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
                {boq.filter((s) => s.parentCode === record.code) && (
                  <NumberInput withAsterisk />
                )}
              </>
            ),
            width: 200,
          },
        ]}
        records={boq.filter((score) => !score.parentCode)}
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedIds,
            onRecordIdsChange: setExpandedIds,
          },
          content: render,
        }}
      />
    </>
  );
}

export function NodeTree({
  childrenScoring,
  boq,
  padding,
}: {
  childrenScoring: BillOfMaterial[];
  boq: BillOfMaterial[];
  padding: number;
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const render = ({ record }) => (
    <NodeTree
      childrenScoring={boq.filter((s) => s.parentCode === record.id)}
      boq={boq}
      padding={20 + padding}
    />
  );

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
            render: ({ id, description }) => (
              <>
                <div className={`flex pl-${padding}`}>
                  <div>
                    {expandedIds.includes(id) ? (
                      <IconChevronDown size={20} />
                    ) : (
                      <IconChevronRight size={20} />
                    )}
                  </div>
                  <span className="whitespace-pre-line">{description}</span>
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
                {boq.filter((s) => s.parentCode === record.code) && (
                  <NumberInput withAsterisk />
                )}
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
          content: render,
        }}
      />
    </>
  );
}
