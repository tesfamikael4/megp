'use client';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import { BillOfMaterial } from '@/models/tender/lot/item/bill-of-material.model';
import { NumberInput } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
interface BOQ extends BillOfMaterial {
  children: BOQ[];
}
export function BillOfMaterialTreeTable({
  boq,
  itemId,
}: {
  boq: BOQ[];
  itemId: string;
}): React.ReactNode {
  const {
    formState: { errors },
    reset,
    control,
  } = useFormContext();
  useEffect(() => {
    if (boq) {
      reset({
        billOfMaterial: boq,
        itemId: itemId,
      });
    }
  }, [boq, reset]);

  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const render = (record, index) => (
    <NodeTree
      childrenScoring={record.children}
      padding={10}
      errors={errors}
      control={control}
      formControl={['billOfMaterial', index, 'children']}
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
            render: (record, index) => (
              <>
                {record.children.length === 0 && (
                  <Controller
                    name={`billOfMaterial.${index}.rate`}
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        withAsterisk
                        placeholder="Rate"
                        value={value}
                        onChange={(d) => onChange(d)}
                        error={
                          errors['billOfMaterial'] &&
                          (errors['billOfMaterial'] ?? '')[`${index}`]
                            ? (errors['billOfMaterial'] ?? '')[`${index}`][
                                'rate'
                              ]?.message?.toString()
                            : ''
                        }
                      />
                    )}
                  />
                )}
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
            onRecordIdsChange: (record) => {
              if (record.length > 0) {
                const newlyAdded = record.filter(
                  (single) => !expandedIds.find((rec) => rec === single),
                );
                const child = boq.find((child) => child.id === newlyAdded[0]);
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
          content: ({ record, index }) => (
            <>{record.children?.length > 0 ? render(record, index) : null}</>
          ),
        }}
      />
    </>
  );
}

export function NodeTree({
  childrenScoring,
  padding,
  errors,
  control,
  formControl,
}: {
  childrenScoring: BOQ[];
  padding: number;
  errors: any;
  control: any;
  formControl: string[];
}): React.ReactNode {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const render = (record: BOQ, index) => {
    return (
      <NodeTree
        childrenScoring={record.children}
        padding={20 + padding}
        errors={errors}
        control={control}
        formControl={[...formControl, index, 'children']}
      />
    );
  };

  const error = () => {
    let err;
    formControl.forEach((cont) => {
      err = err ? err[cont] : errors[cont];
    });
    return err;
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
            render: (record, index) => (
              <>
                {record.children.length === 0 && (
                  <Controller
                    name={`${formControl.join('.')}.${index}.rate`}
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <>
                        <NumberInput
                          withAsterisk
                          placeholder="Rate"
                          value={value}
                          onChange={(d) => onChange(d)}
                          error={
                            error() && (error() ?? '')[`${index}`]
                              ? (error() ?? '')[`${index}`][
                                  'rate'
                                ]?.message?.toString()
                              : ''
                          }
                        />
                      </>
                    )}
                  />
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
          content: ({ record, index }: any) =>
            record.children?.length > 0 ? <>{render(record, index)}</> : null,
        }}
      />
    </>
  );
}
