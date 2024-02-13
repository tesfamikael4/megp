'use client';

import { Box, Button, Group, Textarea } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useCreateMutation, useLazyListQuery } from '../_api/note.api';
import { logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';

export const Note = ({ height }: { height?: string }) => {
  const [value, setValue] = useState<string>('');
  const noteRef = useRef(null);
  const [create, { isLoading: isCreating }] = useCreateMutation();

  const [getNotes, { data }] = useLazyListQuery();
  const { id } = useParams();

  const createNote = async () => {
    const rawData = {
      objectId: id,
      objectType: 'activity',
      content: value,
    };
    try {
      const res = await create(rawData).unwrap();
      logger.log({ res });
      setValue('');
      notify('Success', 'Note Saved Successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    // getNotes({ id, collectionQuery: {} });
    getNotes({
      includes: ['parent'],
      where: [[{ column: 'objectId', value: id, operator: '=' }]],
      orderBy: [
        {
          column: 'createdAt',
          direction: 'DESC',
        },
      ],
    });
    if (noteRef.current) {
      (noteRef.current as any).scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, []);
  return (
    <Box
      className="border rounded overflow-scroll relative"
      h={height ?? '400px'}
    >
      <h1 className="p-2 border-b-2 sticky  top-0 bg-white">Note</h1>
      <Box ref={noteRef}>
        <Box className="p-2 bg-slate-100">
          {data?.items.map((note) => (
            <Box
              className="p-2 bg-white w-fit rounded mb-2 max-w-[80%] cursor-pointer"
              key={note.id}
            >
              <p className="font-semibold border-l-4 border-primary-700 pl-2">
                {note.metaData?.fullName ?? 'Test User'}
              </p>
              <p className="mt-2">{note.content}</p>
              <p className="text-xs mt-1 text-slate-500">
                {new Date(note.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </Box>
          ))}
        </Box>
        <Box className="p-2 bg-white">
          <Textarea
            placeholder="Insert you note here"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            disabled={isCreating}
          />
          <Group justify="space-between" className="mt-2">
            <Button variant="outline">Add File</Button>
            <Button
              disabled={value == ''}
              loading={isCreating}
              onClick={createNote}
            >
              Save
            </Button>
          </Group>
        </Box>
      </Box>
    </Box>
  );
};
