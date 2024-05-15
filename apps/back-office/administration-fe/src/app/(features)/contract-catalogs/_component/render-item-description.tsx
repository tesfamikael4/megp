import { useReadItemMasterQuery } from '@/store/api/contract-catalog/contract-catalog.api';
import { logger } from '@megp/core-fe';

export default function RenderDescription({ record }: { record: any }) {
  const { data: item } = useReadItemMasterQuery(
    record?.itemMasterId?.toString(),
  );
  logger.log('hi', record);

  return <>{item?.description}</>;
}
