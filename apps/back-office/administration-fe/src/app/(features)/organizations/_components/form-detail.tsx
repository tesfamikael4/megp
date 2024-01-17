import { Table } from '@mantine/core';
import { useReadQuery } from '../_api/organizations.api';
import { useParams } from 'next/navigation';
import { useLazyGetOrgTypeQuery } from '@/store/api/budget-category/org-type.api';
import { useEffect } from 'react';

export function FormDetail() {
  const { id } = useParams();

  const { data: org, isSuccess } = useReadQuery(id?.toString());
  const [trigger, { data: type }] = useLazyGetOrgTypeQuery();
  useEffect(() => {
    isSuccess && trigger({ id: org?.typeId });
  }, [isSuccess, org?.typeId, trigger]);

  const data = [
    {
      key: 'Name',
      value: org?.name,
    },
    {
      key: 'Short Name',
      value: org?.shortName,
    },
    {
      key: 'Description',
      value: org?.description,
    },
    {
      key: 'Organization Type',
      value: type?.name,
    },
  ];
  return (
    <Table highlightOnHover withTableBorder withColumnBorders>
      <Table.Tbody>
        {data.map((d) => (
          <>
            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-1/5">
                {d.key}
              </Table.Td>
              <Table.Td>{d.value}</Table.Td>
            </Table.Tr>
          </>
        ))}
      </Table.Tbody>
    </Table>
  );
}
