'use client';
import { EntityList } from '../../../_shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useEffect, useRef, useState } from 'react';
import { useLazyGetUnitTypeQuery } from '@/store/api/unitType/unitType.api';
import DetailUnitType from './detailOrgTypeForm';
import { CollectionQuery } from '@/shared/core/models';

const UnitTypeDetail = () => {
  const config: EntityListConfiguration = {
    title: 'Unit Type',
    listUrl: '/unit-type',
    detailUrl: '/unit-type/detail',
    newUrl: '/unit-type/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'name', name: 'Name' },
      { key: 'description', name: 'description' },
    ],
    sideComponent: <DetailUnitType />,
    actions: ['pdf', 'excel', 'Word', 'Print'],
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

  const [trigger, { data: UnitType, isLoading: isUnitTypeLoading }] =
    useLazyGetUnitTypeQuery();

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
        search={onSearch}
        config={config}
        items={UnitType?.items}
        viewMode="detail"
        total={3}
        titleColumn={'name'}
        selectedItem={'name'}
        showSearchButton={true}
        showNewButton
        showExportButton={true}
        paginationChange={pagination}
        itemsLoading={isUnitTypeLoading}
      />
    </>
  );
};

export default UnitTypeDetail;
