'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useState } from 'react';
import { useLazyGetSectorsQuery } from '@/store/api/sector/sector.api';
const LookupList = () => {
  const config: EntityListConfiguration = {
    title: 'Registration.OrganizationSector',
    listUrl: '/super-administration/organization-section',
    detailUrl: '/super-administration/organization-section/detail',
    newUrl: '/super-administration/organization-section/new',
    detailId: 'id',
    visibleColumn: [{ key: 'name', name: 'Registration.Name' }],

    primaryColumn: {
      key: 'name',
      name: 'Name',
    },
  };

  const [trigger, { data: sectors, isLoading: isUnitLoading, isSuccess }] =
    useLazyGetSectorsQuery();

  useEffect(() => {
    trigger(true);
  }, [trigger]);

  return (
    <>
      <EntityList
        config={config}
        items={sectors?.items ? sectors?.items : []}
        itemsLoading={isUnitLoading}
        viewMode="list"
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
