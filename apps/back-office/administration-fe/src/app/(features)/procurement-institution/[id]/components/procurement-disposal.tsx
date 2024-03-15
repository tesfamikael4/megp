'use client';

import { useLazyGetUnitsQuery } from '@/store/api/iam/iam.api';
import { Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@megp/auth';
import { ExpandableTable, Section, logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useCreateMutation,
  useLazyListByIdQuery,
} from '../../_api/procurement-disposal-unit.api';
import { useUpdateMutation } from '../../_api/ipdc.api';

export const ProcurementDisposal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentUnit, setCurrentUnit] = useState<any[]>([]);
  const { organizationId } = useAuth();
  const [getUnits, { data: units }] = useLazyGetUnitsQuery();
  const { id } = useParams();
  const [getDisposalUnit, { data: disposalUnit }] = useLazyListByIdQuery();
  const [create] = useCreateMutation();
  const [update] = useUpdateMutation();

  const onSave = async () => {
    try {
      if (disposalUnit?.total ?? 0 > 0) {
        const data = {
          id: disposalUnit?.items?.[0].id,
          procurementInstitutionId: id,
          unitId: currentUnit[0].id,
        };
        await update(data).unwrap();
      } else {
        const data = {
          procurementInstitutionId: id,
          unitId: currentUnit[0].id,
        };
        await create(data).unwrap();
      }
      // logger.log({ data });
      notify('Success', 'Procurement Disposal Unit saved successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getDisposalUnit({
      id: id as string,
      collectionQuery: { includes: ['unit'] },
    });
  }, [id]);

  useEffect(() => {
    if (disposalUnit) {
      setCurrentUnit([disposalUnit?.items?.[0].unit]);
    }
  }, [disposalUnit]);
  return (
    <>
      <Section
        title="Procurement Disposal Unit"
        className="mt-4"
        defaultCollapsed
        action={<Button onClick={open}>Add</Button>}
      >
        <ExpandableTable
          config={{ columns: [{ accessor: 'name' }], minHeight: 100 }}
          data={currentUnit}
        />
        <Group className="mt-2" justify="end">
          <Button onClick={onSave} disabled={currentUnit.length === 0}>
            Save
          </Button>
        </Group>
      </Section>

      <Modal onClose={close} opened={opened} title="Units" size={'lg'}>
        <ExpandableTable
          config={{
            columns: [{ accessor: 'name' }],
            isSearchable: true,
            selectedItems: currentUnit,
            setSelectedItems: setCurrentUnit,
            disableMultiSelect: true,
            isSelectable: true,
          }}
          data={units?.items ?? []}
          total={units?.total ?? 0}
          onRequestChange={(request) => {
            getUnits({ organizationId, collectionQuery: request });
          }}
        />
        <Group className="mt-2" justify="end">
          <Button onClick={close}>Done</Button>
        </Group>
      </Modal>
    </>
  );
};
