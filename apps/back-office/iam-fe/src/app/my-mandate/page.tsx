'use client';
import { EntityList } from '../_shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { CollectionQuery } from '@/shared/core/models/collection.model';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetOrganiationMandateQuery } from '@/store/api/organization/organization.api';
const OrganizationList = () => {
  const config: EntityListConfiguration = {
    title: 'My Mandates',
    listUrl: '/my-mandate',
    detailId: '/my-mandate',
    visibleColumn: [{ key: 'mandateName', name: 'Name' }],

    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
    detailUrl: '',
  };

  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    searchFrom: ['name'],
    orderBy: [],
    skip: 0,
    top: 10,
  });

  const [
    trigger,
    { data: mandate, isLoading: ismandateLoading, isSuccess: ismandateFetched },
  ] = useLazyGetOrganiationMandateQuery();

  const orderBy = (data) => {
    setCollectionQuery({ ...collectionQuery, orderBy: [data] });
  };
  const timeout = useRef<any>();
  const inputRef = useRef<any>();
  const onSearch = (data: any) => {
    //Clear the previous timeout.
    clearTimeout(timeout.current);
    // If there is no search term, do not make API call
    timeout.current = setTimeout(async () => {
      setCollectionQuery({ ...collectionQuery, search: data });
    }, 350);
  };

  useEffect(() => {
    if (collectionQuery.filter) {
      trigger(
        {
          items: collectionQuery,
          id: '099454a9-bf8f-45f5-9a4f-6e9034230250',
        },
        true,
      );
    }
  }, [collectionQuery, trigger]);

  return (
    <>
      <EntityList
        config={config}
        search={onSearch}
        order={orderBy}
        items={
          mandate?.organizationMandates ? mandate?.organizationMandates : []
        }
        itemsLoading={ismandateLoading}
        viewMode="list"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        paginationChange={undefined}
      />
    </>
  );
};

export default OrganizationList;
