'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect } from 'react';
import { useLazyGetSectorsQuery } from '@/store/api/sector/sector.api';
import DetailOrganization from './newLookupForm';
const NewLookups = () => {
  const config: EntityListConfiguration = {
    title: 'NewRegistration.OrganizationSector',
    listUrl: '/super-administration/organization-section',
    detailUrl: '/super-administration/organization-section/detail',
    newUrl: '/super-administration/organization-section/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      { key: 'description', name: 'description' },
    ],
    sideComponent: <DetailOrganization />,
    actions: ['pdf', 'excel', 'Word', 'Print'],
    primaryColumn: {
      key: 'name',
      name: 'Registration.Name',
    },
  };

  const [
    trigger,
    { data: sectors, isLoading: isLoading, isSuccess: isFetched },
  ] = useLazyGetSectorsQuery();

  useEffect(() => {
    trigger(true);
  }, [trigger]);

  return (
    <>
      <EntityList
        config={config}
        items={sectors?.items}
        viewMode="detail"
        total={3}
        itemsLoading={isLoading}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={undefined}
      />
    </>
  );
};

export default NewLookups;
