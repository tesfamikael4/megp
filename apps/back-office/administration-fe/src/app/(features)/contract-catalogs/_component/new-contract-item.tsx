import {
  LoadingOverlay,
  Stack,
  NumberInput,
  Group,
  Button,
  Box,
  Flex,
  Textarea,
} from '@mantine/core';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import {
  useLazyGetTemplateQuery,
  useReadContractItemQuery,
  useUpdateContractItemMutation,
} from '@/store/api/contract-catalog/contract-catalog.api';
import { logger, notify } from '@megp/core-fe';

interface ContractItem {
  maximumQuantity: number;
  utilizedQuantity: number;
}

export default function CreateContractItem({
  contractItem,
  onDone,
}: {
  contractItem: any;
  onDone;
}) {
  const contractItemSchema: ZodType<Partial<ContractItem>> = z.object({
    maximumQuantity: z
      .number()
      .min(1, { message: 'Maximum quantity is required' }),
    utilizedQuantity: z
      .number()
      .min(1, { message: 'Utilized quantity  is required' }),
    description: z.string(),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(contractItemSchema),
  });
  const { id } = useParams();

  const [update, { isLoading: isUpdating }] = useUpdateContractItemMutation();
  const [template, { data: templateData }] = useLazyGetTemplateQuery();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadContractItemQuery(id?.toString());

  const onCreate = (data) => {
    onDone &&
      onDone(
        { ...data, specification: templateData?.properties },
        contractItem.id,
      );
  };
  const onUpdate = async (data) => {
    try {
      await update({
        id: id?.toString(),
        ...data,
        itemMasterId: contractItem?.id,
      });
      notify('Success', 'Contract item Updated successfully');
    } catch {
      notify('Error', 'Error in Updating Contract item.');
    }
  };

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        maximumQuantity: selected?.maximumQuantity,
        utilizedQuantity: selected?.utilizedQuantity,
      });
    }
  }, [reset, selected, selectedSuccess]);

  useEffect(() => {
    template(contractItem.itemMasterId?.toString());
  }, [contractItem]);

  useEffect(() => {
    logger.log('contractItem', contractItem?.description);
    reset({
      description: contractItem?.description,
    });
  }, [contractItem?.description]);

  return (
    <>
      <Stack pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Flex gap="sm">
          <Box className="w-1/2">
            <Textarea
              label={'description'}
              disabled
              {...register('description')}
            />

            <Controller
              name="maximumQuantity"
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumberInput
                  withAsterisk
                  label="Maximum Quantity"
                  value={value}
                  onChange={(value) => onChange(value)}
                  error={
                    errors?.maximumQuantity
                      ? errors?.maximumQuantity?.message?.toString()
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
                  onChange={(value) => onChange(value)}
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
        <Group className="ml-auto">
          {selected ? (
            <Button onClick={handleSubmit(onUpdate)} loading={isUpdating}>
              Update
            </Button>
          ) : (
            <Button onClick={handleSubmit(onCreate)}>Save</Button>
          )}
        </Group>
      </Stack>
    </>
  );
}
