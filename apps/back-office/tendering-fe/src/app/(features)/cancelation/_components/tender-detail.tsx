import {
  LoadingOverlay,
  Flex,
  Table,
  Button,
  Text,
  Group,
} from '@mantine/core';
import { useEffect } from 'react';
import { notify } from '@megp/core-fe';
import {
  useDeleteMutation,
  useReadQuery,
} from '@/app/(features)/preparation/_api/tender/tender.api';
import { useParams } from 'next/navigation';
import { IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useLazyGetPRDetailQuery } from '@/app/(features)/preparation/_api/tender/procurement-requisition.api';

export default function TenderDetail() {
  const { id } = useParams();
  const {
    data: selectedTender,
    isSuccess: selectedTenderSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [trigger, { data, isLoading: prLoading }] = useLazyGetPRDetailQuery();

  useEffect(() => {
    if (selectedTenderSuccess && selectedTender !== undefined) {
      trigger(selectedTender.prId);
    }
  }, [selectedTender, selectedTenderSuccess, trigger]);
  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: `Re-advertize Tender`,
      centered: true,
      children: (
        <Text size="sm">{`Are you sure you want to re-advertize this tender `}</Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await remove(id?.toString())
          .unwrap()
          .then(() => {
            notify('Success', 'tender re-advertised successfully');
          })
          .catch(() => {
            notify('Error', 'Error in deleting tender');
          });
      },
    });
  };
  return (
    <div>
      <LoadingOverlay visible={isLoading || prLoading} />

      <Flex direction={'column'} gap={'sm'} mt={'md'}>
        <div>
          {selectedTender && (
            <Table highlightOnHover withTableBorder withColumnBorders>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className="bg-slate-100 font-semibold w-2/6">
                    Procurement Reference
                  </Table.Td>
                  <Table.Td>
                    {selectedTender.procurementReferenceNumber}
                  </Table.Td>
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
          )}
        </div>
      </Flex>
      <Group>
        <Button
          color="red"
          className="mt-4"
          leftSection={<IconX size={14} stroke={1.6} />}
          loading={isDeleting}
          onClick={openDeleteModal}
        >
          Cancel
        </Button>
      </Group>
    </div>
  );
}
