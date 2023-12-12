'use client';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLazySecondRelationQuery } from '../organizations/_api/organization-mandate.api';
import { MyMandate } from '@/models/mandate';
import { useAuth } from '@megp/auth';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const { user } = useAuth();
  const [request, setRequest] = useState<any>();

  const pathname = usePathname();

  const [trigger, { data, isFetching }] = useLazySecondRelationQuery();

  useEffect;
  const config: EntityConfig<MyMandate> = useMemo(() => {
    return {
      basePath: '/my-mandate',
      mode: 'list',
      entity: 'my-mandate',
      primaryKey: 'id',
      title: 'My Mandates',
      onDetail: (selected: MyMandate) => {
        route.push(`/my-mandate/${selected?.mandateId}`);
      },

      onSearch: (search) => {
        // console.log('search', search);
      },
      pagination: true,
      searchable: true,
      sortable: true,

      hasAdd: false,
      hasDetail: true,
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'mandate.name',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },

        {
          id: 'mandate.description',
          header: 'Description',
          accessorKey: 'mandate.description',
          cell: (info) => info.getValue(),
        },
        {
          id: 'isSingleAssignment',
          header: 'Single Assignment ',
          accessorKey: 'isSingleAssignment',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  const mode =
    pathname === `/my-mandate`
      ? 'list'
      : pathname === `/my-mandate/new`
      ? 'new'
      : 'detail';
  useEffect(() => {
    const onRequestChange = (request: CollectionQuery) => {
      user &&
        trigger({
          id: user.organization.id,
          collectionQuery: request,
        });
    };
    setRequest(onRequestChange);
  }, [trigger, user]);

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={
        data?.items?.map((item: MyMandate) => {
          return {
            ...item,
            isSingleAssignment: item.mandate.isSingleAssignment ? 'Yes' : 'No ',
          };
        }) ?? []
      }
      total={data?.total ?? 0}
      detail={children}
      isLoading={isFetching}
      onRequestChange={request}
    />
  );
}
