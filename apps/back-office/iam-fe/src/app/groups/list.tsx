import { EntityList, EntityConfig } from '@megp/core-fe';

export function List() {
  const config: EntityConfig = {
    entity: 'group',
    title: 'Groups',
    canAdd: true,
    addPath: '/groups/new',
  };
  return <EntityList config={config} />;
}
