'use client';

import { Box, Button, Group, Textarea } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useCreateMutation } from '../_api/note.api';
import { logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';

export const Note = ({ height }: { height?: string }) => {
  const [value, setValue] = useState<string>('');
  const noteRef = useRef(null);
  const [create, { isLoading: isCreating }] = useCreateMutation();
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
          {[1, 2, 3, 4, 5, 6].map((m) => (
            <>
              <Box className="p-2 bg-white w-fit rounded mb-2 max-w-[80%] cursor-pointer">
                <p className="font-semibold border-l-4 border-primary-700 pl-2">
                  Test User
                </p>
                <p className="mt-2">
                  Test Message 3121 Test Message Test Message Test Message Test
                  Message Test Message Test Message
                </p>
                <p className="text-xs mt-1 text-slate-500">Today 12:09 pm</p>
              </Box>
              <Box className="p-2 bg-white w-fit rounded mb-2 max-w-[80%] cursor-pointer">
                <p className="font-semibold text-primary-800">Test User</p>
                <p className="mt-2">
                  Test Message 3121 Test Message Test Message Test Message Test
                  Message Test Message Test Message
                </p>
                <p className="text-xs mt-1 text-slate-500">Today 12:09 pm</p>
              </Box>
            </>
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
