'use client';
import { useLazyListByIdQuery } from './_api/activities.api';
import { CollectionQuery, EntityConfig, EntityLayout } from '@megp/entity';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState, useEffect } from 'react';

export function Entity({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  // const [onRequest, setOnRequest] = useState<any>();
  // const [workflowId ] = useState(
  //   '9bdffbcb-d7f6-499c-a93c-5e2639991dbe',
  // );

  const pathname = usePathname();

  // const [trigger, { data: activities, isFetching }] = useLazyListByIdQuery();

  const config: EntityConfig<any> = useMemo(() => {
    return {
      basePath: '/workflow',
      mode: 'list',
      entity: 'workflow',
      primaryKey: 'name',
      title: 'Workflows',
      onAdd: () => {
        route.push(`/workflow/new`);
      },
      onDetail: (selected: any) => {
        route.push(`/workflow/${selected?.id}`);
      },
      hasAdd: true,
      hasDetail: true,
      pagination: true,
      searchable: true,
      sortable: true,
      // onSearch: (search) => {
      //   // console.log('search', search);
      // },

      columns: [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          cell: (info) => info.getValue(),
          meta: {
            widget: 'primary',
          },
        },
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
          cell: (info) => info.getValue(),
        },
      ],
    };
  }, [route]);

  // const onRequestChange = useCallback(
  //   (request: CollectionQuery) => {
  //     trigger({ id: workflowId, collectionQuery: request });
  //   },
  //   [trigger, workflowId],
  // );

  // useEffect(() => {
  //   setOnRequest(onRequestChange);
  // }, [onRequestChange, onRequest]);

  const mode =
    pathname === `/workflow`
      ? 'list'
      : pathname === `/workflow/new`
      ? 'new'
      : 'detail';

  return (
    <EntityLayout
      mode={mode}
      config={config}
      data={[
        {
          id: '1f344819-d64d-4986-b192-ee06f5bf0e98',
          name: 'preBudgetApproval',
          workflowId: 'b769aa67-b135-48b2-9060-72b11336d61f',
        },
      ]}
      total={3}
      // onRequestChange={onRequestChange}
      // isLoading={isFetching}
      detail={children}
    />
  );
}
