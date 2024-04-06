import { DeleteButton } from '@/app/(features)/_components/delete-button';
import { Box, Card, Flex, Group, Image, Paper, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { ShowFile } from '../../_components/review/panels/showFile';
import { useDeleteBriefcaseFileMutation } from '../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';

const DocumentDetail = ({ row, setRow, fetch }: any) => {
  const [status, setStatus] = useState('');
  const [deleteFile, { isLoading, isSuccess }] =
    useDeleteBriefcaseFileMutation();

  const handleDelete = async (id) => {
    if (id) {
      try {
        await deleteFile({ id })
          .unwrap()
          .then(() => {
            NotificationService.successNotification(
              'File deleted successfully',
            );
            fetch();
            setRow(null);
          });
      } catch (error) {
        NotificationService.requestErrorNotification(
          'Something went wrong while deleting the file',
        );
      }
    }
  };

  return (
    <Paper className="relative w-full shadow-xs rounded-md" px={'sm'}>
      <Flex align="center" fw={700} justify="space-between" py={'xs'}>
        <Text>Document Detail</Text>{' '}
        <IconX
          size={20}
          onClick={() => setRow(null)}
          className="absolute top-2 right-2 cursor-pointer"
          color="red"
        />
      </Flex>
      <Card padding="lg" radius="md">
        <Card.Section>
          <ShowFile
            setStatus={setStatus}
            filename={row.attachmentId}
            url={`${process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api'}/briefcases/download/${row.attachmentId}`}
            zoom
            download
          />
        </Card.Section>
        {status === 'success' && (
          <>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>
                Name:{' '}
                {row.attachmentId?.substring(
                  0,
                  row?.attachmentId?.indexOf('.'),
                )}
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              Size: {row && (row as any).size}
            </Text>
            <Flex justify={'flex-end'}>
              <DeleteButton
                onDelete={() => handleDelete((row as any).id)}
                buttonName="Delete"
                title={`Delete ${row && (row as any).name}`}
                message={`Are you sure you want to delete ${row && (row as any).attachmentId}`}
                isDeleting={isLoading}
              />
            </Flex>
          </>
        )}
      </Card>
    </Paper>
  );
};

export default DocumentDetail;
