'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { CollectionQuery } from '@/shared/core/models/collection.model';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetMandatesQuery } from '@/store/api/role/role.api';

import DetailMandate from './newMandateForm';
const OrganizationList = () => {
  const config: EntityListConfiguration = {
    title: 'Mandates',
    listUrl: '/mandate',
    detailUrl: '/mandate/detail',
    newUrl: '/mandate/new',
    sideComponent: <DetailMandate />,
    detailId: 'id',
    visibleColumn: [{ key: 'name', name: 'Name' }],
    actions: ['pdf', 'excel', 'Word', 'Print'],
    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
  };

  const [
    trigger,
    {
      data: organization,
      isLoading: isorganizationLoading,
      isSuccess: isOrganizationFetched,
    },
  ] = useLazyGetMandatesQuery();
  const [items, setItems] = useState([]);

  useEffect(() => {
    trigger(true);
  }, []);

  return (
    <>
      <EntityList
        config={config}
        items={organization?.items ? organization?.items : []}
        itemsLoading={isorganizationLoading}
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

export default OrganizationList;
