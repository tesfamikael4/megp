'use client';
import {
  Stack,
  TextInput,
  Box,
  Modal,
  NumberInput,
  Group,
  Button,
  Flex,
} from '@mantine/core';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { useCreateAllocatedItemMutation } from '@/store/api/contract-catalog/contract-catalog.api';
import { useDisclosure } from '@mantine/hooks';
import SelectOrganization from './select-organization';
import { Section, notify } from '@megp/core-fe';
import { useLazyReadItemMasterQuery } from '@/store/api/contract-catalog/contract-catalog.api';

interface AllocatedItem {
  maximumQuantity: number;
  utilizedQuantity: number;
}

export default function ContractAllocatedItem({
  beneficiary,
}: {
  beneficiary: any;
}) {
  const AllocateditemSchema: ZodType<Partial<AllocatedItem>> = z.object({
    maximumQuantity: z.number(),
    utilizedQuantity: z.number(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(AllocateditemSchema),
  });
  // const router = useRouter();

  const [opened, { open, close }] = useDisclosure();
  const [selectedOrg, setSelectedOrg] = useState<any[]>([]);
  const [triggerItem, { data: item }] = useLazyReadItemMasterQuery();

  const [create] = useCreateAllocatedItemMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        contractItemId: selectedOrg[0]?.id,
        itemMasterId: selectedOrg[0]?.itemMasterId,
        contractBeneficiaryId: beneficiary.id,
      }).unwrap();

      // router.push(`/contract-catalogs/${result?.id}`);
      notify('Success', 'Contract catalog Created successfully');
    } catch (error) {
      const errorMessage =
        error.data?.message || error.message || 'Something went wrong';
      notify('Error', errorMessage);
    }
  };
  useEffect(() => {
    triggerItem(selectedOrg[0]?.itemMasterId);
  }, [selectedOrg]);

  return (
    <Section title="Allocated item" collapsible={false}>
      <Stack pos="relative">
        <Flex gap={4}>
          <Box className="w-1/2">
            <TextInput
              label={'Select Contract Item'}
              onClick={open}
              value={item?.description}
            />
            <Controller
              name="maximumQuantity"
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumberInput
                  withAsterisk
                  label="Maximum Quantity"
                  value={value}
                  onChange={onChange}
                  error={
                    errors?.contractReferenceNumber
                      ? errors?.contractReferenceNumber?.message?.toString()
                      : ''
                  }
                  required
                />
              )}
            />
          </Box>
          <Box className="w-1/2">
            <Controller
              name="utilizedQuantity"
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumberInput
                  withAsterisk
                  label="Utilized Quantity"
                  value={value}
                  onChange={onChange}
                  error={
                    errors?.utilizedQuantity
                      ? errors?.utilizedQuantity?.message?.toString()
                      : ''
                  }
                  required
                />
              )}
            />
          </Box>
        </Flex>

        <Group>
          <Button onClick={handleSubmit(onCreate)} className="ml-auto">
            Save
          </Button>
        </Group>
        <Modal
          title={<Box fw={'bold'}>Select Vendor</Box>}
          onClose={close}
          opened={opened}
          size={'xl'}
        >
          <SelectOrganization
            selectedOrg={selectedOrg}
            opened={opened}
            close={close}
            setSelectedOrg={setSelectedOrg}
            mode="item"
          />
        </Modal>
      </Stack>
    </Section>
  );
}
