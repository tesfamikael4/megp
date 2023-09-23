'use client';
import { EntityList } from '../_shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { CollectionQuery } from '@/shared/core/models/collection.model';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetAllMandatesQuery } from '@/store/api/organization/organization.api';
const OrganizationList = () => {
  const config: EntityListConfiguration = {
    title: 'Mandates',
    listUrl: '/mandate',
    detailId: '/mandate',
    visibleColumn: [{ key: 'name', name: 'Name' }],

    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
    detailUrl: '',
  };

  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    searchFrom: ['name', 'shortName'],
    orderBy: [],
    skip: 0,
    top: 10,
  });

  const [
    trigger,
    { data: mandate, isLoading: ismandateLoading, isSuccess: ismandateFetched },
  ] = useLazyGetAllMandatesQuery();

  const pagination = (data) => {
    setCollectionQuery({ ...collectionQuery, skip: data.skip, top: data.top });
  };

  const filter = (data) => {
    setCollectionQuery({ ...collectionQuery, filter: data });
  };

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
        items={mandate?.items ? mandate?.items : []}
        itemsLoading={ismandateLoading}
        viewMode="list"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        paginationChange={pagination}
      />
    </>
  );
};

export default OrganizationList;
