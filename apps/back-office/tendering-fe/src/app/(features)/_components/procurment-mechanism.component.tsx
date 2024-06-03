import { DetailTable } from './detail-table';

export default function ProcurmentMechanism({
  procurementMechanisms,
}: {
  procurementMechanisms: any;
}) {
  const config = [
    {
      key: 'Procurement Type',
      value: procurementMechanisms.procurementType,
    },
    {
      key: 'Procurement Method',
      value: procurementMechanisms?.procurementMethod,
    },
    {
      key: 'Funding Source',
      value: procurementMechanisms?.fundingSource,
    },
    {
      key: 'Procurement Process',
      value: procurementMechanisms?.isOnline ? 'Online' : 'Offline',
    },
    {
      key: 'Supplier Target Group',
      value: procurementMechanisms.targetGroup.join(', '),
    },
  ];

  return (
    <>
      <DetailTable data={config} />
    </>
  );
}
