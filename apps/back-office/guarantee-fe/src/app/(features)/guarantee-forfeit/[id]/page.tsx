'use client';
import { Accordion, Divider, Stack, Table, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';

import { IconFileInvoice } from '@tabler/icons-react';
import { useState } from 'react';
import { FormDetail } from '../_components/form-detail';

export default function ReleasePage() {
  const [openedTerm, setOpenedTerm] = useState(false);

  const togglePanel = () => {
    setOpenedTerm(!openedTerm);
  };
  return (
    <Stack>
      <Section title=" Guarantee Request Detail" collapsible={true}>
        <Table h={100} className="mb-5 ">
          <Table.Tbody className=" border-2">
            <Table.Tr className=" border-2 ">
              <Table.Th className="bg-[#edf3f8] font-normal  w-72 font-normal text-[14px]">
                Guaranter Name
              </Table.Th>
              <Table.Td>
                <Text size="sm">Zemen</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr className=" border-2 ">
              <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                Validity Date
              </Table.Th>
              <Table.Td>
                <Text size="sm">Mar/30/2024</Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr className=" border-2 ">
              <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                Request Date
              </Table.Th>
              <Table.Td>
                <Text size="sm">Mar/30/2024</Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                Submission Deadline
              </Table.Th>
              <Table.Td className=" ">
                <Text size="sm">Mar/30/2024</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                Guarantee Status
              </Table.Th>
              <Table.Td className=" ">
                <Text size="sm">Approved</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="bg-[#edf3f8] font-normal text-[14px]  ">
                Procuring Entity Name
              </Table.Th>
              <Table.Td className=" ">
                <Text size="sm">Perago </Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                Security Currency
              </Table.Th>
              <Table.Td className=" ">
                <Text size="sm">MMK</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="bg-[#edf3f8] font-normal text-[14px] ">
                Security Amount
              </Table.Th>
              <Table.Td className=" ">
                <Text size="sm">20, 000</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="bg-[#edf3f8] font-normal text-[14px]  ">
                Security Form
              </Table.Th>
              <Table.Td className=" ">
                <Text size="sm">string</Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        <Accordion
          className=""
          defaultValue="Terms and Conditions"
          variant="contained"
        >
          <Accordion.Item value={'    Terms and Conditions'}>
            <Accordion.Control
              className="pl-0"
              icon={<IconFileInvoice />}
              styles={{
                icon: {
                  color: '#363591',
                },
              }}
              onClick={togglePanel}
            >
              Terms and Conditions
            </Accordion.Control>

            <Accordion.Panel c="dimmed" className="pl-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              varius sollicitudin dictum. Nulla pulvinar accumsan nunc, non
              ultrices dolor elementum ut. Maecenas accumsan, risus vitae
              maximus facilisis, est purus mollis lacus, eu volutpat lacus purus
              non velit. Integer malesuada ultricies ex ut pellentesque. Nulla
              facilisi. Integer elementum porta nisi vitae vestibulum. Maecenas
              id neque vestibulum, convallis lacus sit amet, suscipit sapien.
              Aliquam sed neque erat. Cras ipsum magna, vehicula viverra diam
              eu, blandit pharetra ipsum. Curabitur efficitur nibh id ex varius
              pulvinar.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Accordion
          variant="contained"
          className="mt-5"
          defaultValue="Terms and Conditions"
        >
          <Accordion.Item value={'    Terms and Conditions'}>
            <Accordion.Control
              className="pl-0"
              icon={<IconFileInvoice />}
              styles={{
                icon: {
                  color: '#363591',
                },
              }}
              onClick={togglePanel}
            >
              Guarantee Remarks
            </Accordion.Control>

            <Accordion.Panel c="dimmed" className="pl-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              varius sollicitudin dictum. Nulla pulvinar accumsan nunc, non
              ultrices dolor elementum ut. Maecenas accumsan, risus vitae
              maximus facilisis, est purus mollis lacus, eu volutpat lacus purus
              non velit. Integer malesuada ultricies ex ut pellentesque. Nulla
              facilisi. Integer elementum porta nisi vitae vestibulum. Maecenas
              id neque vestibulum, convallis lacus sit amet, suscipit sapien.
              Aliquam sed neque erat. Cras ipsum magna, vehicula viverra diam
              eu, blandit pharetra ipsum. Curabitur efficitur nibh id ex varius
              pulvinar.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <FormDetail mode="new" />
      </Section>
    </Stack>
  );
}
