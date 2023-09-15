import { EntityList } from '@megp/core-fe';

export function List() {
  const config = {
    key: 'group',
  };
  return <EntityList config={config} />;
}
