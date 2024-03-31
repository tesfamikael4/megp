import {
  Box,
  Button,
  Divider,
  LoadingOverlay,
  Modal,
  Table,
} from '@mantine/core';
import { Section, logger, notify } from '@megp/core-fe';
import { useDisclosure } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../_api/tender/tender-spd.api';
import { useLazyReadQuery as spdUseLazyReadQuery } from '../../_api/tender/config-spd.api';
import TenderSpd from './tender-spd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TenderConfigSpd() {
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [marketType, setMarketType] = useState<string>('');
  const [procurementCategory, setProcurementCategory] = useState<string>('');

  const [
    trigger,
    { isLoading: isSpdLoading, isSuccess: isSpdSuccess, data: selectedSpd },
  ] = spdUseLazyReadQuery();
  const [create, { isLoading: isSaving }] = useCreateMutation();

  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());

  const handelTenderSpd = (data) => {
    onCreate(data);
  };
  const onCreate = async (data) => {
    try {
      await create({
        spdId: data.id,
        tenderId: id?.toString(),
      });
      notify(
        'Success',
        'Tendering Standard Procurement Document created successfully',
      );
    } catch (err) {
      notify(
        'Error',
        'Error in creating Tendering Standard Procurement Document',
      );
    }
  };

  useEffect(() => {
    if (selected && isSuccess) {
      trigger(selected.spdId);
      if (selectedSpd && isSpdSuccess) {
        setName(selectedSpd.name);
        setDescription(selectedSpd.description);
        setMarketType(selectedSpd.marketType);
        setProcurementCategory(selectedSpd.procurementCategory);
      }
    }
  }, [isSuccess, selected, isSpdSuccess, selectedSpd, trigger]);

  return (
    <Section
      title="Standard Procurement Document"
      collapsible={true}
      defaultCollapsed={true}
      action={<Button onClick={open}>Select</Button>}
      className="capitalize my-2"
    >
      <LoadingOverlay visible={isLoading || isSaving || isSpdLoading} />
      <div>
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Name
              </Table.Td>
              <Table.Td>{name}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Market Type
              </Table.Td>
              <Table.Td>{marketType}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Procurement Category
              </Table.Td>
              <Table.Td>{procurementCategory}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Description
              </Table.Td>
              <Table.Td>{description}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <Modal
        opened={opened}
        size={'80%'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Select Standard Procurement Document
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm mx-2">
          <TenderSpd onSelect={handelTenderSpd} />
        </Box>
      </Modal>
    </Section>
  );
}
