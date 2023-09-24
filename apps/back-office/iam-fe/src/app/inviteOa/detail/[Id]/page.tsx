'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect } from 'react';
import { useLazyGetOrganizationsQuery } from '@/store/api/organization/organization.api';
import DetailOrganization from './personnelDetail';
import PersonnelDetail from './personnelDetail';
const InvitedOaList = () => {
  const config: EntityListConfiguration = {
    title: 'Personnels',
    listUrl: '/inviteOa',
    detailUrl: '/inviteOa/detail',
    newUrl: '/inviteOa/new',
    detailId: 'id',
    visibleColumn: [{ key: 'name', name: 'Name' }],
    sideComponent: <PersonnelDetail />,
    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
  };

  const [trigger, { data: personnel, isLoading: isPersonnelLoading }] =
    useLazyGetOrganizationsQuery();

  useEffect(() => {
    trigger(true);
  }, [trigger]);

  return (
    <>
      <EntityList
        config={config}
        items={personnel?.items}
        viewMode="detail"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        itemsLoading={isPersonnelLoading}
        showSearchButton={true}
        showNewButton
        showExportButton={true}
        paginationChange={undefined}
      />
    </>
  );
};

export default InvitedOaList;
