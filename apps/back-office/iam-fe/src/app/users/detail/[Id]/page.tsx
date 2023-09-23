'use client';

import { useEffect, useRef, useState } from 'react';

import { useLazyGetUsersQuery } from '@/store/api/user/user.api';
import Detailuser from './detailUnitForm';
import { CollectionQuery } from '@/shared/core/models';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';

const UserNew = () => {
  const config: EntityListConfiguration = {
    title: 'Users',
    listUrl: '/users',
    detailUrl: '/users/detail',
    newUrl: '/users/new',

    detailId: 'id',
    visibleColumn: [{ key: 'fullName', name: 'fullName' }],
    sideComponent: <Detailuser />,
    actions: ['pdf', 'excel', 'Word', 'Print'],
    primaryColumn: {
      key: 'fullName',
      name: ' fullName',
    },
  };

  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    searchFrom: ['fullName'],
    orderBy: [],
    skip: 0,
    top: 10,
  });

  const [items, setItems] = useState();
  const [
    trigger,
    { data: users, isLoading: isuserLoading, isSuccess: isuserFetched },
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
    if (isuserFetched) {
      setItems(
        users?.items?.map((item) => {
          return {
            ...item,
            fullName: ` ${item?.firstName} ${item.lastName}`,
          };
        }),
      );
    }
  }, [isuserFetched, users?.items]);

  return (
    <>
      <EntityList
        config={config}
        search={onSearch}
        items={items}
        viewMode="detail"
        total={3}
        itemsLoading={isuserLoading}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={pagination}
      />
    </>
  );
};

export default UserNew;
