import { CollectionSelectorConfig } from '@/shared/collection-selector/model/collection-selector-config';
import { ModalCollectionSelector } from '@/shared/collection-selector/components/modal-collection-selector';
import { CollectionQuery } from '@/shared/core/models/collection.model';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useLazyGetMandateQuery } from '@/store/api/role/role.api';
import { usePathname } from 'next/navigation';

type ModalMandateProps = {
  onDone: any;
  onCancel: () => void;
  isOpened: boolean;
  openModal: () => void;
  selectedRows?: any[];
};
function MandateSelector(props: ModalMandateProps) {
  const [opened, setOpened] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>();
  let selectedRows: any[] | undefined = props.selectedRows;
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    skip: 0,
    top: 10,
  });

  const config: CollectionSelectorConfig = {
    identity: 'id',
    multiple: true,
    visibleColumn: [{ key: 'name', name: 'Mandate' }],
    size: 'lg',
    title: 'Mandate Assignment',
  };
  const pagination = (data) => {
    setCollectionQuery({ ...collectionQuery, skip: data.skip, top: data.top });
  };

  const search = (data) => {
    setCollectionQuery({ ...collectionQuery, search: data });
  };

  const onSelectedRow = (data) => {
    selectedRows = data;
  };

  function onDone(): void {
    props.onDone(selectedRows);
  }

  const [getAllMandates, { data: items, isLoading }] = useLazyGetMandateQuery();

  useEffect(() => {
    getAllMandates(true);
  }, [getAllMandates]);
  return (
    <>
      <div className="w-full">
        <ModalCollectionSelector
          search={search}
          items={items?.items}
          config={config}
          hasSort={true}
          paginationChange={pagination}
          total={items?.count || 0}
          modalOpened={props.isOpened}
          setModalOpened={props.openModal}
          onDone={(items) => props.onDone(items)}
          collectionQuery={collectionQuery}
          selectedRows={selectedRows}
        />
      </div>
    </>
  );
}
export default MandateSelector;
