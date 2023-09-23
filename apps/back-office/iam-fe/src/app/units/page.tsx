'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetUnitQuery } from '@/store/api/unit/unit.api';
import { CollectionQuery } from '@/shared/core/models';

const UnitNew = () => {
  const config: EntityListConfiguration = {
    title: 'Unit',
    listUrl: '/units',
    detailUrl: '/units/detail',
    newUrl: '/units/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      { key: 'description', name: 'description' },
    ],
    actions: ['pdf', 'excel', 'Word', 'Print'],
    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
  };

  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    searchFrom: ['name', 'description'],
    orderBy: [],
    skip: 0,
    top: 10,
  });

  const pagination = (data) => {
    setCollectionQuery({
      ...collectionQuery,
      skip: data.skip,
      top: data.top,
    });
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

  const [
    trigger,
    { data: unit, isLoading: isUnitLoading, isSuccess: isUnitFetched },
  ] = useLazyGetUnitQuery();

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
        filter={filter}
        order={orderBy}
        config={config}
        items={unit?.items}
        viewMode="list"
        search={onSearch}
        itemsLoading={isUnitLoading}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={pagination}
        total={0}
      />
    </>
  );
};

export default UnitNew;
