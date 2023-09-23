'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { CollectionQuery } from '@/shared/core/models/collection.model';
import { useEffect, useRef, useState } from 'react';
import { useLazyGetrolesQuery } from '@/store/api/role/role.api';
import DetailRole from './roleDetail';
const RoleList = () => {
  const config: EntityListConfiguration = {
    title: 'Roles',
    listUrl: '/roles',
    detailUrl: '/roles/detail',
    newUrl: '/roles/new',
    sideComponent: <DetailRole />,
    detailId: 'id',
    visibleColumn: [{ key: 'name', name: 'Name' }],

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

  const pagination = (data) => {
    setCollectionQuery({ ...collectionQuery, skip: data.skip, top: data.top });
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
    { data: role, isLoading: isroleLoading, isSuccess: isrolenFetched },
  ] = useLazyGetrolesQuery();

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
        items={role?.items ? role?.items : []}
        itemsLoading={isroleLoading}
        viewMode="detail"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={pagination}
      />
    </>
  );
};

export default RoleList;
