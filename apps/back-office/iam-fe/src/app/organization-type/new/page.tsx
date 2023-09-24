'use client';
import { EntityList } from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetOrganizationTypeQuery } from '@/store/api/orgType/orgType.api';
import DetailOrgType from './newOrgTypeForm';
import { CollectionQuery } from '@/shared/core/models';

const OrgTypeNew = () => {
  const config: EntityListConfiguration = {
    title: 'OrganizationType',
    listUrl: '/organization-type',
    detailUrl: '/organization-type/detail',
    newUrl: '/organization-type/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      { key: 'description', name: 'description' },
    ],
    actions: ['pdf', 'excel', 'Word', 'Print'],
    sideComponent: <DetailOrgType />,
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
    { data: orgType, isLoading: isorgTypeLoading, isSuccess: isorgTypeFetched },
  ] = useLazyGetOrganizationTypeQuery();

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
        items={orgType?.items}
        viewMode="detail"
        total={3}
        itemsLoading={isorgTypeLoading}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        paginationChange={pagination}
      />
    </>
  );
};

export default OrgTypeNew;
