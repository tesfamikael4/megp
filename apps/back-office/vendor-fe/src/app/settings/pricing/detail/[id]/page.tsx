'use client';

import EntityList from '@/shared/entity-list/component/entity-list';
import { EntityListConfiguration } from '@/shared/entity-list/model/entity-list-config';
import { PricingDetail } from '../../_shared/pricing-detail';
import { useLazyGetPricesQuery } from '@/store/api/pricing/pricing.api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CollectionQuery } from '@/shared/core/models';

export default function DetailPrice() {
  const [getPrices, { data, isLoading, isSuccess }] = useLazyGetPricesQuery();
  const { id } = useParams();
  const [selectedItem, setSelectedItem] = useState<any>({});
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
    sideComponent: <PricingDetail mode="update" />,
    visibleColumn: [
      { key: 'service', name: 'Service', hasLocal: true },
      { key: 'business_area', name: 'Business Area', hasLocal: true },
      { key: 'value_from', name: 'Value From' },
      { key: 'value_to', name: 'Value To' },
      { key: 'fee', name: 'Fee', hasLocal: true },
      { key: 'currency', name: 'Currency' },
    ],
    primaryColumn: {
      key: 'businessArea',
      name: 'Business Area',
      hasLocal: true,
    },
  };

  useEffect(() => {
    getPrices({ collectionQuesry: collectionQuery });
  }, [collectionQuery]);

  useEffect(() => {
    if (isSuccess) {
      setSelectedItem(data?.items?.filter((e) => e.id == id));
    }
  }, [data?.items, isSuccess]);
  const onPaginationChange = (data: any) => {
    setCollectionQuery({ ...collectionQuery, skip: data.skip, top: data.top });
  };
  const onSearch = (query: any) => {
    setCollectionQuery({ ...collectionQuery, search: query });
  };
  return (
    <>
      <EntityList
        config={config}
        paginationChange={onPaginationChange}
        viewMode="detail"
        total={data?.total}
        items={data?.items}
        itemsLoading={isLoading}
        titleColumn="Service Prices"
        showSearchButton
        selectedItem={selectedItem}
        showNewButton
        search={onSearch}
      />
    </>
  );
}
