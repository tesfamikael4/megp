'use client';
import { EntityList } from '../_shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { CollectionQuery } from '@/shared/core/models/collection.model';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetInvitedOaQuery } from '@/store/api/organization/organization.api';
const InvitedOaList = () => {
  const config: EntityListConfiguration = {
    title: 'Personnels',
    listUrl: '/inviteOa',
    detailUrl: '/invitedOaList/detail',
    newUrl: '/inviteOa/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      { key: 'email', name: 'Email' },
      { key: 'status', name: 'Status' },
      { key: 'isActive', name: 'IsActive' },
    ],

    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
  };

  const [
    trigger,
    {
      data: personnel,
      isLoading: ispersonnelLoading,
      isSuccess: ispersonnelFetched,
    },
  ] = useLazyGetInvitedOaQuery();
  const [items, setItems] = useState([]);

  useEffect(() => {
    trigger(true);
  }, []);
  useEffect(() => {
    if (ispersonnelFetched) {
      setItems(
        personnel?.items?.map((item) => {
          return { ...item, isActive: item.isActive ? 'Yes' : ' No' };
        }),
      );
    }
  }, [ispersonnelFetched, personnel]);

  return (
    <>
      <EntityList
        config={config}
        items={items ? items : []}
        itemsLoading={ispersonnelLoading}
        viewMode="list"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={undefined}
      />
    </>
  );
};

export default InvitedOaList;
