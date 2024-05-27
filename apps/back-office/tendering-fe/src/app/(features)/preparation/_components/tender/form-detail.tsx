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
import { useLazyGetPRDetailQuery } from '../../_api/tender/procurement-requisition.api';

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
  const [trigger, { data, isLoading: prLoading }] = useLazyGetPRDetailQuery();

  const onCreate = (data) => {
    notify('Success', 'Tendering created successfully');
  };

  const onUpdate = (data) => {
    update({ ...data, id: id?.toString() })
      .unwrap()
      .then(() => {
        notify('Success', 'Tendering Updated successfully');
      })
      .catch(() => {
        notify('Error', 'Error Updating Tender');
      });
  };

  useEffect(() => {
    if (selectedTenderSuccess && selectedTender !== undefined) {
      trigger(selectedTender.prId);
      reset({
        name: selectedTender?.name,
      });
    }
  }, [reset, selectedTender, selectedTenderSuccess, trigger]);

  return (
    <div>
      <LoadingOverlay visible={isLoading || prLoading} />
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
                  Procurement Reference
                </Table.Td>
                <Table.Td>{selectedTender.procurementReferenceNumber}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Market Estimate
                </Table.Td>
                <Table.Td>
                  {selectedTender.marketEstimate}{' '}
                  {selectedTender.marketEstimateCurrency}
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Budget Amount Currency
                </Table.Td>
                <Table.Td>
                  {selectedTender.budgetAmount}{' '}
                  {selectedTender.budgetAmountCurrency}
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Calculated Amount
                </Table.Td>
                <Table.Td>
                  {data?.calculatedAmount} {data?.currency}
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Description
                </Table.Td>
                <Table.Td>{data?.description}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Is Custom
                </Table.Td>
                <Table.Td>{data?.isCustom ? 'Yes' : 'No'}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Is Fund Available
                </Table.Td>
                <Table.Td>{data?.isFundAvailable ? 'Yes' : 'No'}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Is Multi Year
                </Table.Td>
                <Table.Td>{data?.isMultiYear ? 'Yes' : 'No'}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Is Planned
                </Table.Td>
                <Table.Td>{data?.isPlanned ? 'Yes' : 'No'}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Is Used
                </Table.Td>
                <Table.Td>{data?.isUsed ? 'Yes' : 'No'}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Procurement Application
                </Table.Td>
                <Table.Td>{data?.procurementApplication}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Procurement Reference
                </Table.Td>
                <Table.Td>{data?.procurementReference}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Remark
                </Table.Td>
                <Table.Td>{data?.remark}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  User Reference
                </Table.Td>
                <Table.Td>{data?.userReference}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="bg-slate-100 font-semibold w-2/6">
                  Total Estimate Amount
                </Table.Td>
                <Table.Td>{data?.totalEstimatedAmount}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </Flex>
    </div>
  );
}
