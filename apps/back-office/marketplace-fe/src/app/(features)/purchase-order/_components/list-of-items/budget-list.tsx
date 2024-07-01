import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section } from '@megp/core-fe';
import { IconPlus } from '@tabler/icons-react';
import ShipmentModal from './shipment-modal';
import BudgetSource from './budget-source';

export default function BudgetList() {
  const [opened, { open, close }] = useDisclosure();
  const config = {
    columns: [
      {
        accessory: 'name',
        title: 'Name',
      },
    ],
  };
  return (
    <>
      <Section
        collapsible={false}
        title={'Budget'}
        action={
          <Button onClick={open}>
            <IconPlus onClick={open} size={14} />
            New
          </Button>
        }
      >
        <ExpandableTable config={config} data={[]} />
      </Section>
      <BudgetSource opened={opened} close={close} />
    </>
  );
}
