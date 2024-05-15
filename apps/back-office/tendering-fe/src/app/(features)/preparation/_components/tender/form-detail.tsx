import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, LoadingOverlay, Flex, Table } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { Tender } from '@/models/tender/tender.model';
import {
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/tender.api';
import { useParams } from 'next/navigation';

export default function FormDetail() {
  const { id } = useParams();
  const tenderSchema: ZodType<Partial<Tender>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    data: selectedTender,
    isSuccess: selectedTenderSuccess,
    isLoading,
  } = useReadQuery(id?.toString());
  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({ resolver: zodResolver(tenderSchema) });

  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = (data) => {
    logger.log(data);
    notify('Success', 'Tendering created successfully');
  };

  const onUpdate = (data) => {
    logger.log(data);
    update({ ...data, id: id?.toString() });
    notify('Success', 'Tendering Updated successfully');
  };

  useEffect(() => {
    if (selectedTenderSuccess && selectedTender !== undefined) {
      reset({
        name: selectedTender?.name,
      });
    }
  }, [reset, selectedTender, selectedTenderSuccess]);

  return (
    <div>
      <LoadingOverlay visible={isLoading} />
      <TextInput
        withAsterisk
        label="Name"
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        {...register('name')}
      />
      <EntityButton
        mode={selectedTender ? 'detail' : 'new'}
        data={{ selectedTender }}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        isSaving={false}
        isUpdating={isUpdating}
      />
      <Flex direction={'column'} gap={'sm'} mt={'md'}>
        <div>
          <Table highlightOnHover withTableBorder withColumnBorders>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Procurment Category
                </Table.Td>
                <Table.Td>{selectedTender.procurementCategory}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Procurement Reference
                </Table.Td>
                <Table.Td>{selectedTender.procurementReferenceNumber}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Market Estimate
                </Table.Td>
                <Table.Td>{selectedTender.marketEstimate}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Budget Code
                </Table.Td>
                <Table.Td>{selectedTender.budgetCode}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Budget Amount Currency
                </Table.Td>
                <Table.Td>{selectedTender.budgetAmountCurrency}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Organization Name
                </Table.Td>
                <Table.Td>{selectedTender.organizationName}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Status
                </Table.Td>
                <Table.Td>{selectedTender.status}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </Flex>
    </div>
  );
}
