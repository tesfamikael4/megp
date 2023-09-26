'use client';
import { useEffect, useRef, useState } from 'react';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useLazyGetUsersQuery } from '@/store/api/user/user.api';
import EntityList from '@/shared/entity-list/component/entity-list';
import { useRouter } from 'next/navigation';
import { CollectionQuery } from '@/shared/core/models';

const NewUser = () => {
  const router = useRouter();
  const [items, setItems] = useState();
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    searchFrom: ['fullName'],
    orderBy: [],
    skip: 0,
    top: 5,
  });
  const timeout = useRef<any>();
  const onSearch = (data: any) => {
    //Clear the previous timeout.
    clearTimeout(timeout.current);
    // If there is no search term, do not make API call
    timeout.current = setTimeout(async () => {
      setCollectionQuery({ ...collectionQuery, search: data });
    }, 350);
  };

  const onPagination = (data) => {
    setCollectionQuery({ ...collectionQuery, skip: data.skip, top: data.top });
  };

  const orderBy = (data: { field: any; direction: any }) => {
    setCollectionQuery({
      ...collectionQuery,
      orderBy: [{ field: data.field, direction: data.direction }],
    });
  };

  const config: EntityListConfiguration = {
    title: 'Users',
    listUrl: '/users',
    detailUrl: '/users/detail',
    newUrl: '/users/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'fullName', name: 'Name' },
      { key: 'username', name: 'User Name' },
      { key: 'email', name: 'Email' },
      { key: 'isActive', name: 'Active', isBoolean: true },
    ],

    filter: [
      [
        {
          fieldName: 'status',
          field: 'isActive',
          value: true,
          operator: '=',
          name: 'Active',
        },
        {
          fieldName: 'status',
          field: 'isActive',
          value: false,
          operator: '=',
          name: 'Inactive',
        },
      ],
    ],
    primaryColumn: {
      key: 'id',
      name: ' id',
    },
  };

  const filter = (data) => {
    setCollectionQuery({ ...collectionQuery, filter: data });
  };

  const [
    trigger,
    {
      data: users,
      isLoading: isUserLoading,
      isFetching: isUserFetching,
      isSuccess,
    },
  ] = useLazyGetUsersQuery();

  useEffect(() => {
    trigger(true);
  }, [trigger]);

  useEffect(() => {
    if (isSuccess) {
      setItems(
        users?.items?.map((item) => {
          return {
            ...item,
            isActive: item.isActive ? 'Yes' : 'No ',
          };
        }),
      );
    }
  }, [isSuccess, users?.items]);

  return (
    <EntityList
      config={config}
      items={items}
      viewMode="list"
      total={4}
      filter={filter}
      titleColumn={'id'}
      selectedItem={'id'}
      itemsLoading={isUserLoading || isUserFetching}
      showSearchButton={true}
      showNewButton
      paginationChange={onPagination}
      search={onSearch}
      order={orderBy}
      collectionQuery={collectionQuery}
    />
  );
};

export default NewUser;
