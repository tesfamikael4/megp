'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useRef, useState } from 'react';
import { useLazyGetOrganizationsQuery } from '@/store/api/organization/organization.api';
import { CollectionQuery } from '@/shared/core/models';

const NewOrganization = () => {
  const [items, setItems] = useState();
  const config: EntityListConfiguration = {
    title: 'Organization',
    listUrl: '/organizations',
    detailUrl: '/organizations/detail',
    newUrl: '/organizations/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      { key: 'shortName', name: 'Short Name' },
      { key: 'Code', name: 'User Name' },

      { key: 'isActive', name: 'Active' },
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
      key: 'name',
      name: ' Name',
    },
  };
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    searchFrom: ['name', 'shortName'],
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

  const [trigger, { data: organization, isSuccess }] =
    useLazyGetOrganizationsQuery();

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
    if (isSuccess) {
      setItems(
        organization?.items?.map((item) => {
          return { ...item, isActive: item.isActive ? 'Yes' : 'No ' };
        }),
      );
    }
  });

  return (
    <>
      <EntityList
        filter={filter}
        order={orderBy}
        config={config}
        items={items}
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

export default NewOrganization;
