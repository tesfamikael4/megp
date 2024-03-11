'use client';
import { BidSecurity } from '@/models/bidSecurity';
import {
  useLazyGetUintByIdQuery,
  useOrganizationsQuery,
} from '@/store/api/organazation/organazation.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  Box,
  Divider,
  Flex,
  Select,
  Table,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { CollectionQuery } from '@megp/entity';
import { IconFileInvoice } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const defaultValues = {
  guarantorId: '',
  guarantorBranchId: '',
  remark: '',
};

const DetailBidSecurity = () => {
  const bidSecuritySchema: ZodType<Partial<BidSecurity>> = z.object({
    guarantorId: z.string().min(1, { message: 'This field is required' }),
    guarantorBranchId: z.string().min(1, { message: 'This field is required' }),
    remark: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
    watch,
  } = useForm({
    resolver: zodResolver(bidSecuritySchema),
  });

  const [openedTerm, setOpenedTerm] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const togglePanel = () => {
    setOpenedTerm(!openedTerm);
  };
  const { data: guarantor } = useOrganizationsQuery({});
  const [trigger, { data }] = useLazyGetUintByIdQuery();
  const guarantorId = watch('guarantorId');

  useEffect(() => {
    if (guarantorId) {
      const request: CollectionQuery = {
        where: [
          [
            {
              column: 'parentId',
              value: guarantorId,
              operator: '=',
            },
          ],
        ],
      };
      trigger(guarantorId);
    }
  }, [guarantorId]);

  return (
    <Flex>
      <Box className=" w-full p-6 bg-[#e7f4f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-3 ">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              Lot Info
            </Text>
          </Flex>
          <Table h={100} className="mb-5 ">
            <Table.Tbody className=" border-2">
              <Table.Tr className=" border-2 ">
                <Table.Th className="bg-[#edf3f8] font-normal  w-72 font-normal text-[14px]">
                  Reference Number
                </Table.Th>
                <Table.Td>
                  <Text size="sm">AD23-987HJG-976-HJU</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr className=" border-2 ">
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                  Tender Name
                </Table.Th>
                <Table.Td>
                  <Text size="sm">Tender 1</Text>
                </Table.Td>
              </Table.Tr>

              <Table.Tr className=" border-2 ">
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]   ">
                  Reference Name
                </Table.Th>
                <Table.Td>
                  <Text size="sm">Equivalent 00.00</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="bg-[#edf3f8] font-normal text-[14px]">
                  Valid Date
                </Table.Th>
                <Table.Td className=" ">
                  <Text size="sm">Feb/01/2024</Text>
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
          <Divider my="md" className="w-full" size={'xs'} />

          <Accordion className="" defaultValue="Terms and Conditions">
            <Accordion.Item value={'    Terms and Conditions'}>
              <Accordion.Control
                className="pl-0"
                icon={<IconFileInvoice />}
                styles={{
                  icon: {
                    color: '#40C057',
                  },
                }}
                onClick={togglePanel}
              >
                Terms and Conditions
              </Accordion.Control>
              {!openedTerm && (
                <Text c="dimmed" className="pl-9 line-clamp-1 text-[14px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aliquam varius sollicitudin dictum. Nulla pulvinar accumsan
                  nunc, non ultrices dolor elementum ut. Maecenas accumsan,
                  risus vitae maximus facilisis, est purus mollis lacus, eu
                  volutpat lacus purus non velit. Integer malesuada ultricies ex
                  ut pellentesque. Nulla facilisi. Integer elementum porta nisi
                  vitae vestibulum. Maecenas id neque vestibulum, convallis
                  lacus sit amet, suscipit sapien. Aliquam sed neque erat. Cras
                  ipsum magna, vehicula viverra diam eu, blandit pharetra ipsum.
                  Curabitur efficitur nibh id ex varius pulvinar.
                </Text>
              )}
              <Accordion.Panel c="dimmed" className="pl-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                varius sollicitudin dictum. Nulla pulvinar accumsan nunc, non
                ultrices dolor elementum ut. Maecenas accumsan, risus vitae
                maximus facilisis, est purus mollis lacus, eu volutpat lacus
                purus non velit. Integer malesuada ultricies ex ut pellentesque.
                Nulla facilisi. Integer elementum porta nisi vitae vestibulum.
                Maecenas id neque vestibulum, convallis lacus sit amet, suscipit
                sapien. Aliquam sed neque erat. Cras ipsum magna, vehicula
                viverra diam eu, blandit pharetra ipsum. Curabitur efficitur
                nibh id ex varius pulvinar.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Flex gap={30} className="mt-5">
            <Controller
              name="guarantorId"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  w={570}
                  name={name}
                  disabled
                  label="Guarantor"
                  value={value}
                  withAsterisk
                  error={
                    errors?.guarantorId
                      ? errors?.guarantorId?.message?.toString()
                      : ''
                  }
                  onChange={onChange}
                  data={
                    guarantor?.items?.map((guarantor) => ({
                      value: guarantor?.id,
                      label: guarantor?.name,
                    })) || []
                  }
                />
              )}
            />
            <Controller
              name="guarantorBranchId"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  w={570}
                  disabled
                  name={name}
                  label="Guarantor Branch"
                  value={value}
                  withAsterisk
                  error={
                    errors?.guarantorId
                      ? errors?.guarantorId?.message?.toString()
                      : ''
                  }
                  onChange={onChange}
                  data={
                    data?.items?.map((branch) => ({
                      value: branch?.id,
                      label: branch?.name,
                    })) || []
                  }
                />
              )}
            />
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default DetailBidSecurity;
