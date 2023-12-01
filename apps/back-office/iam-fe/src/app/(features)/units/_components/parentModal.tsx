import { Button, Modal, Text } from '@mantine/core';
import { EntityConfig } from '@megp/entity';
import { TreeList } from '@megp/entity/src/components/entity/modal-tree';
import { IconTrashX } from '@tabler/icons-react';
import { Unit } from '@/models/unit';
import { useMemo, useState } from 'react';

interface ParentModalProps {
  data: any;
  parentUnitId: string;
  setParentUnitId: any;
}

export function ParentModal({
  data,
  parentUnitId,
  setParentUnitId,
}: ParentModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const config: EntityConfig<Unit> = useMemo(() => {
    return {
      basePath: '/units',
      mode: 'list',
      entity: 'units',
      primaryKey: 'id',
      title: 'Units',

      hasDetail: false,

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
      ],
    };
  }, []);

  return (
    <>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={'lg'}
        title={'Unit Selection'}
      >
        <TreeList
          data={data}
          mode="tree"
          config={config}
          hasTree
          parentUnitId={parentUnitId}
          setParentUnitId={setParentUnitId}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
      <Button
        className="flex justify-center align-middle"
        leftSection={<IconTrashX size={14} stroke={1.6} />}
        onClick={() => setIsModalOpen(true)}
      >
        select
      </Button>
    </>
  );
}
