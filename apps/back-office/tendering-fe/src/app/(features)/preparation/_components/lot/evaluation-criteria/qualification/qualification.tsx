'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section, logger } from '@megp/core-fe';
import { Box, Button, Divider, Flex, Menu, Modal, Text } from '@mantine/core';
import {
  IconPlus,
  IconDotsVertical,
  IconEye,
  IconTrash,
  IconX,
  IconPencil,
} from '@tabler/icons-react';
import {
  useDeleteMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/preparation/_api/lot/qualification.api';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { QualificationFormDetail } from './qualification-form-detail';
import { useDisclosure } from '@mantine/hooks';
import { DetailQualification } from './qualification-detail';
import type { Qualification } from '@/models/tender/lot/qualification.model';
import { CollectionQuery } from '@megp/entity';
import QualificationCategoryEditor from './qualification-category-editor';

export default function Qualification({ lotId }: { lotId: string }) {
  const [trigger, { data, isFetching, isSuccess }] = useLazyListByIdQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [editorOpened, { open: openEditor, close: closeEditor }] =
    useDisclosure(false);
  const [qId, setQId] = useState('');
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [qualificationList, setQualificationList] = useState<any>({});
  const [category, setCategory] = useState('');
  const config = {
    columns: [
      { accessor: 'factor', title: 'Factor', width: 150 },
      {
        accessor: 'requirement',
        title: 'Criterion / Requirement',
        width: 300,
      },
      {
        accessor: 'formLink',
        title: 'Document Requirement',
        width: 150,
      },
      {
        accessor: 'action',
        header: 'Action',
        render: (record) => <Action qualification={record} />,
        width: 70,
      },
    ],
    isExpandable: true,
    isSearchable: true,
    isLoading: isFetching || isDeleting,
    primaryColumn: 'factor',
    expandedRowContent: (qualification) => {
      return <DetailQualification cell={qualification} />;
    },
  };

  const Action = ({ qualification }: { qualification: Qualification }) => {
    const openDeleteModal = () => {
      modals.openConfirmModal({
        title: `Delete ${qualification.category} qualification`,
        centered: true,
        children: (
          <Text size="sm">
            {`Are you sure you want to delete this ${qualification.category} qualification `}
          </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        confirmProps: { color: 'red' },
        onConfirm: handleDelete,
      });
    };
    const handleDelete = async () => {
      try {
        await remove(qualification.id).unwrap();
        notifications.show({
          title: 'Success',
          message: `Qualification Deleted Successfully`,
          color: 'green',
        });
      } catch (err) {
        logger.log(err);
        notifications.show({
          title: 'Error',
          message: 'Something went wrong',
          color: 'red',
        });
      }
    };

    return (
      <Menu shadow="md">
        <Menu.Target>
          <IconDotsVertical
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="ml-auto text-gray-500"
            size={16}
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEye size={15} />}
            onClick={() => {
              setQId(qualification.id);
              setMode('detail');
              open();
            }}
          >
            View
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={15} />}
            onClick={openDeleteModal}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      id: lotId,
      collectionQuery: {
        ...request,
      },
    });
  };

  const onReturnFunction = () => {
    close();
    trigger({
      id: lotId,
      collectionQuery: {},
    });
  };

  useEffect(() => {
    trigger({
      id: lotId,
      collectionQuery: {},
    });
  }, [lotId]);

  const onEditCategory = (category: string) => {
    openEditor();
    setCategory(category);
  };

  useEffect(() => {
    if (isSuccess && data) {
      logger.log(data);
      const value = data.items.reduce((accumulator: any, item: any) => {
        if (!accumulator[item.category]) {
          accumulator[item.category] = [];
        }
        accumulator[item.category].push(item);
        return accumulator;
      }, {});
      if (value) {
        logger.log(value);
        setQualificationList({ ...value });
      }
    }
  }, [data, isSuccess]);

  return (
    <>
      {Object.keys(qualificationList).map((item, index) => (
        <Section
          title={item}
          collapsible={true}
          defaultCollapsed={true}
          className="capitalize"
          action={
            <Flex gap={'md'}>
              <Button onClick={() => onEditCategory(item)} variant="light">
                <IconPencil size={14} /> Edit Category
              </Button>
              <Button onClick={open}>
                <IconPlus size={14} /> Add
              </Button>
            </Flex>
          }
          key={index}
        >
          <ExpandableTable
            config={config}
            data={qualificationList[item] ?? []}
            total={qualificationList[item].length ?? 0}
            onRequestChange={onRequestChange}
          />
          <Modal
            opened={opened}
            size={'50%'}
            onClose={close}
            withCloseButton={false}
          >
            <div className="flex justify-between">
              <h2 className="font-medium text-lg capitalize">{item}</h2>
              <IconX onClick={close} />
            </div>
            <Divider mt={'md'} mb={'md'} />
            <Box className="bg-white rounded shadow-sm mx-2">
              <QualificationFormDetail
                mode={mode}
                adId={qId}
                type={item}
                lotId={lotId}
                returnFunction={onReturnFunction}
              />
            </Box>
          </Modal>

          <Modal
            opened={editorOpened}
            size={'50%'}
            onClose={closeEditor}
            withCloseButton={false}
          >
            <div className="flex justify-between">
              <h2 className="font-medium text-lg capitalize">
                Edit Qualification Category
              </h2>
              <IconX onClick={closeEditor} />
            </div>
            <Divider mt={'md'} mb={'md'} />
            <Box className="bg-white rounded shadow-sm mx-2">
              <QualificationCategoryEditor category={category} lotId={lotId} />
            </Box>
          </Modal>
        </Section>
      ))}
    </>
  );
}
