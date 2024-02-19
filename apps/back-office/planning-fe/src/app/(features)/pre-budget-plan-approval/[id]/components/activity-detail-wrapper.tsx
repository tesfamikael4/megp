'use client';

import { useCreateMutation } from '@/app/(features)/(app)/_api/note.api';
import { Box, Button, Group, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { logger, notify } from '@megp/core-fe';
import { IconMessage2 } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export const ActivityDetailWrapper = ({
  children,
  type,
  className = '',
}: any) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [value, setValue] = useState('');
  const { id } = useParams();

  const createComment = async () => {
    const rawData = {
      objectId: id,
      objectType: 'activity',
      content: value,
      key: 'comment',
    };
    try {
      const res = await create(rawData).unwrap();
      logger.log({ res });
      setValue('');
      close();
      notify('Success', 'Comment Saved Successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  return (
    <div className={`relative ${className}`}>
      <div className="absolute right-0 top-0 z-10 cursor-pointer">
        <IconMessage2 onClick={toggle} />
      </div>
      {opened && (
        <Box p={4}>
          <Textarea
            className="w-full h-full"
            label="Comment"
            minRows={4}
            maxRows={5}
            autosize
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write a comment"
          />
          <Group className="mt-2" justify="end">
            <Button
              onClick={createComment}
              loading={isCreating}
              disabled={value.length === 0}
            >
              Save
            </Button>
          </Group>
        </Box>
      )}
      {children}
    </div>
  );
};
