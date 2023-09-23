'use client';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetUnitQuery } from '@/store/api/unit/unit.api';
import DetailUnit from './detailUnitForm';
import { CollectionQuery } from '@/shared/core/models';
import EntityList from '@/shared/entity-list/component/entity-list';
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
    sideComponent: <DetailUnit />,
    actions: ['pdf', 'excel', 'Word', 'Print'],
    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
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
    { data: unit, isLoading: isUnitLoading, isSuccess: isUnitFetched },
  ] = useLazyGetUnitQuery();

  const pagination = (data) => {
    setCollectionQuery({
      ...collectionQuery,
      skip: data.skip,
      top: data.top,
    });
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
        items={unit?.items}
        viewMode="detail"
        total={3}
        itemsLoading={isUnitLoading}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={pagination}
      />
    </>
  );
};

export default UnitNew;
