'use client';
import { EntityList } from '../../_shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useRef, useState } from 'react';
import { useLazyGetOrganizationsQuery } from '@/store/api/organization/organization.api';
import DetailOrganization from './newOrganizationForm';
import { CollectionQuery } from '@/shared/core/models';
const NewOrganization = () => {
  const config: EntityListConfiguration = {
    title: 'Organization',
    listUrl: '/organizations',
    detailUrl: '/organizations/detail',
    newUrl: '/organizations/new',
    detailId: 'id',
    visibleColumn: [{ key: 'name', name: 'Name' }],
    sideComponent: <DetailOrganization />,

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
    setCollectionQuery({
      ...collectionQuery,
      skip: data.skip,
      top: data.top,
    });
  };

  const [trigger, { data: organization }] = useLazyGetOrganizationsQuery();

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
    trigger(true);
  }, [trigger]);

  return (
    <>
      <EntityList
        config={config}
        search={onSearch}
        items={organization?.items}
        viewMode="detail"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        inputRef={inputRef}
        showNewButton
        showExportButton={true}
        paginationChange={pagination}
      />
    </>
  );
};

export default NewOrganization;
