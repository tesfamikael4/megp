'use client';

import { useLazyGetUnitsQuery } from '@/store/api/iam/iam.api';
import { Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@megp/auth';
import { ExpandableTable, Section, logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export const ProcurementDisposal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentUnit, setCurrentUnit] = useState<any[]>([]);
  const { organizationId } = useAuth();
  const [getUnits, { data: units }] = useLazyGetUnitsQuery();
  const { id } = useParams();

  const onSave = async () => {
    try {
      const data = {
        procurementInstituionId: id,
        unitId: currentUnit[0].id,
        unitName: currentUnit[0].name,
      };
      logger.log({ data });
      notify('Success', 'Procurement Disposal Unit saved successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <>
      <Section
        title="Procurement Disposal Unit"
        className="mt-4"
        defaultCollapsed
        action={<Button onClick={open}>Add</Button>}
      >
        <ExpandableTable
          config={{ columns: [{ accessor: 'name' }] }}
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
