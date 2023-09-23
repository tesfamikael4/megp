'use client';
import { EntityList } from '../../_shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect } from 'react';
import { useLazyGetInvitedOaQuery } from '@/store/api/organization/organization.api';
import DetailOrganization from './newInviteOa';
const NewInviteOa = () => {
  const config: EntityListConfiguration = {
    title: 'Personnels',
    listUrl: '/inviteOa',
    detailUrl: '/inviteOa/detail',
    newUrl: '/inviteOa/new',
    detailId: 'id',
    visibleColumn: [{ key: 'name', name: 'Name' }],
    sideComponent: <DetailOrganization />,

    primaryColumn: {
      key: 'name',
      name: ' Name',
    },
  };

  const [trigger, { data: personnel }] = useLazyGetInvitedOaQuery();

  useEffect(() => {
    trigger(true);
  }, [trigger]);

  return (
    <>
      <EntityList
        config={config}
        items={personnel?.items}
        viewMode="detail"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        showExportButton={true}
        paginationChange={undefined}
      />
    </>
  );
};

export default NewInviteOa;
