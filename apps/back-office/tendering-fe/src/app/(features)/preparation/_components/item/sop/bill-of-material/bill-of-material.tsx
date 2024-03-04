'use client';
import { Section } from '@megp/core-fe';
import { Box, Button, Divider, Modal } from '@mantine/core';
import { IconX, IconPlus } from '@tabler/icons-react';
import { useGetBillOfMaterialQuery } from '../../../../_api/item/bill-of-material-tree.api';
import { useDisclosure } from '@mantine/hooks';
import { BillOfMaterialFormDetail } from './bill-of-material-form-detail';
import { BillOfMaterialTreeTable } from './bill-of-material-tree';
import { Item } from '@/models/tender/lot/item';

export default function BillOfMaterial({ item }: { item: Item }) {
  const { data: billOfMaterial } = useGetBillOfMaterialQuery({
    itemId: item.id,
    collectionQuery: {
      where: [],
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Section
      title="Bill Of Material"
      collapsible={true}
      defaultCollapsed={true}
      action={
        <Button onClick={open}>
          <IconPlus size={14} /> Add
        </Button>
      }
    >
      <BillOfMaterialTreeTable
        boq={billOfMaterial ? billOfMaterial.items : []}
      />
      <Modal
        opened={opened}
        size={'xl'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">Document</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <BillOfMaterialFormDetail mode="new" />
        </Box>
      </Modal>
    </Section>
  );
}
