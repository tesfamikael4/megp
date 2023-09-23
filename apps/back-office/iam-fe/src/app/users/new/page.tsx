'use client';
import { EntityList } from '../../_shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useRef, useState } from 'react';
import { useLazyGetUsersQuery } from '@/store/api/user/user.api';
import { useLazyGetUnitQuery } from '@/store/api/unit/unit.api';
import DetailOrganization from './newUnitForm';
import { CollectionQuery } from '@/shared/core/models';
const UnitNew = () => {
  const config: EntityListConfiguration = {
    title: 'Users',
    listUrl: '/users',
    detailUrl: '/users/detail',
    newUrl: '/users/new',

    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      { key: 'description', name: 'description' },
    ],
    sideComponent: <DetailOrganization />,
    actions: ['pdf', 'excel', 'Word', 'Print'],
    primaryColumn: {
      key: 'fullName',
      name: ' Full Name',
    },
  };

  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    searchFrom: ['fullName'],
    orderBy: [],
    skip: 0,
    top: 10,
  });

  const [
    trigger,
    { data: users, isLoading: isUnitLoading, isSuccess: isUnitFetched },
  ] = useLazyGetUsersQuery();

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
  const [items, setItems] = useState();

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

  useEffect(() => {
    if (isUnitFetched) {
      setItems(
        users?.items?.map((item) => {
          return {
            ...item,

            fullName: ` ${item?.firstName} ${item.lastName}`,
          };
        }),
      );
    }
  }, [isUnitFetched, users?.items]);
  return (
    <>
      <EntityList
        config={config}
        search={onSearch}
        items={items}
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
