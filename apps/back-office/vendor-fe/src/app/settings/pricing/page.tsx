'use client';

import { CollectionQuery } from '@/shared/core/models';
import EntityList from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { useLazyGetPricesQuery } from '@/store/api/pricing/pricing.api';
import { useEffect, useState } from 'react';

export default function Pricing() {
  const [castedData, setCastedData] = useState<any[]>([]);
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 10,
  });
  const config: EntityListConfiguration = {
    title: 'Service Prices',
    listUrl: '/settings/pricing',
    detailUrl: '/settings/pricing/detail',
    newUrl: '/settings/pricing/new',
    detailId: 'id',
    visibleColumn: [
      { key: 'service', name: 'Service', hasLocal: true },
      { key: 'businessArea', name: 'Business Area', hasLocal: true },
      { key: 'valueFrom', name: 'Value From' },
      { key: 'valueTo', name: 'Value To' },
      { key: 'fee', name: 'Fee', hasLocal: true },
      { key: 'currency', name: 'Currency' },
    ],
    primaryColumn: {
      key: 'name',
      name: ' Name',
      hasLocal: true,
    },
  };
  const [getPrices, { data, isLoading, isSuccess }] = useLazyGetPricesQuery();
  const onPaginationChange = (data: any) => {
    setCollectionQuery({ ...collectionQuery, skip: data.skip, top: data.top });
  };

  const onSearch = (query: any) => {
    setCollectionQuery({ ...collectionQuery, search: query });
  };

  useEffect(() => {
    getPrices({ collectionQuery: collectionQuery });
  }, [collectionQuery]);
  useEffect(() => {
    if (isSuccess) {
      setCastedData(castData(data.items));
    }
  }, [data]);

  const castData = (data: any[]) => {
    const temp: any[] = [];
    data.map((d) => {
      temp.push({
        id: d.id,
        businessArea: d.businessArea,
        valueFrom: d.valueFrom,
        valueTo: d.valueTo,
        fee: d.fee,
        currency: d.currency,
        service: d.service.name,
      });
    });

    return temp;
  };
  return (
    <EntityList
      config={config}
      paginationChange={onPaginationChange}
      viewMode="list"
      total={data?.total}
      items={castedData}
      itemsLoading={isLoading}
      titleColumn="Service Prices"
      showNewButton
      showSearchButton
      search={onSearch}
    />
  );
}
