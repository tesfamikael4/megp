'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useState } from 'react';
import { useLazyGetOrganizationTypeQuery } from '@/store/api/lookUps/lookups.api';

import DetailLookup from './newLookupForm';
const LookupList = () => {
  const config: EntityListConfiguration = {
    title: 'Lookup Values',
    listUrl: 'lookups',
    detailUrl: 'lookups/detail',
    newUrl: 'lookups/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      { key: 'description', name: 'Description' },
    ],
    sideComponent: <DetailLookup />,
    actions: ['pdf', 'excel', 'Word', 'Print'],
    primaryColumn: {
      key: 'name',
      name: 'Name',
    },
  };

  const [trigger, { data: orgType, isLoading: isUnitLoading, isSuccess }] =
    useLazyGetOrganizationTypeQuery();

  useEffect(() => {
    trigger(true);
  }, [trigger]);

  return (
    <>
      <EntityList
        config={config}
        items={orgType ? orgType?.items : []}
        itemsLoading={isUnitLoading}
        viewMode="detail"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={undefined}
      />
    </>
  );
};

export default LookupList;
