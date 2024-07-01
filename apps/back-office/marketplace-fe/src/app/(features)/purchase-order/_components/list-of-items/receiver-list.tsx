import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section } from '@megp/core-fe';
import { IconPlus } from '@tabler/icons-react';
import Receiver from './receiver';

export default function ReceiverList() {
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
        title={'Receiver'}
        action={
          <Button>
            <IconPlus onClick={open} />
            New
          </Button>
        }
      >
        <ExpandableTable config={config} data={[]} />
        <Receiver opened={opened} close={close} />
      </Section>
    </>
  );
}
