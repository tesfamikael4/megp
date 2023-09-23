'use client';
import { EntityList } from '../_shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { CollectionQuery } from '@/shared/core/models/collection.model';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetrolesQuery } from '@/store/api/role/role.api';
const OrganizationList = () => {
  const config: EntityListConfiguration = {
    title: 'Roles',
    listUrl: '/roles',
    detailUrl: '/roles/detail',
    newUrl: '/roles/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      {
        key: 'description',
        name: 'Description',
      },
      {
        key: 'key',
        name: 'Key',
      },
    ],
    filter: [
      [
        {
          fieldName: 'System Role',
          field: 'isSystemRole',
          value: true,
          operator: '=',
          name: 'Yes',
        },
        {
          fieldName: 'System Role',
          field: 'isSystemRole',
          value: false,
          operator: '=',
          name: 'No',
        },
      ],
    ],
    actions: ['pdf', 'excel', 'Word', 'Print'],
    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
  };

  const [
    trigger,
    { data: roles, isLoading: isrolesLoading, isSuccess: isRoleFetched },
  ] = useLazyGetrolesQuery();

  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    searchFrom: ['name'],
    orderBy: [],
    skip: 0,
    top: 10,
  });

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
        filter={filter}
        order={orderBy}
        items={roles?.items ? roles?.items : []}
        itemsLoading={isrolesLoading}
        viewMode="list"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={pagination}
        search={onSearch}
      />
    </>
  );
};

export default OrganizationList;
