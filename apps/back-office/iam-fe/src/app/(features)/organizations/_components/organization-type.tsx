import { useReadQuery } from '../../organization-type/_api/organization-type.api';

interface prop {
  id: string;
}
export function Type({ id }: prop) {
  const { data: type } = useReadQuery(id?.toString());

  return <>{type?.name}</>;
}
