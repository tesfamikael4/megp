'use client';

import { ActionIcon, Alert, Box, Menu, Tabs, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useAuth } from '@megp/auth';
import {
  IconArrowForwardUp,
  IconChevronDown,
  IconTrash,
} from '@tabler/icons-react';
import type { ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import type { IHighlight } from 'react-pdf-highlighter';
// import { useDeleteMutation } from '../(app)/_api/note.api';
import { notify } from '@megp/core-fe';

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  workflow,
  selectedHash,
}: {
  highlights: { highlight: IHighlight; from: Record<string, string> }[];
  workflow?: React.ReactNode;
  selectedHash: string;
}): ReactElement {
  const { user } = useAuth();

  return (
    <div className="p-5 border-r" style={{ width: '25vw' }}>
      <Tabs defaultValue={'comments'}>
        <Tabs.List>
          <Tabs.Tab value="comments">Comments</Tabs.Tab>
          {workflow && <Tabs.Tab value="workflow">Workflow</Tabs.Tab>}
        </Tabs.List>

        <Tabs.Panel value="comments" className="">
          <ul className=" pb-10 mt-2 overflow-y-scroll  h-[95vh]">
            {highlights.map((highlight, index) => {
              return (
                <Box
                  className="mb-2"
                  key={index}
                  onClick={() => {
                    updateHash(highlight.highlight);
                  }}
                >
                  <div
                    id={`hash-${highlight.highlight.id}`}
                    className={`border rounded p-2 mr-5 mb-2 cursor-pointer bg-white`}
                  >
                    <p className="border-l-4 px-2 border-[rgb(77,74,184)] font-semibold text-sm flex justify-between">
                      {highlight?.from.fullName}
                    </p>
                    {highlight?.highlight?.content?.text ? (
                      <Alert className=" ml-2 mt-2 border-l-4 border-[rgb(77,74,184)]">
                        <p className="text-xs line-clamp-3">
                          {highlight?.highlight.content.text}
                        </p>

                        <p className="text-xs mt-2">
                          Page{' '}
                          {
                            highlight?.highlight.position.boundingRect
                              .pageNumber
                          }
                        </p>
                      </Alert>
                    ) : null}

                    {/* Highlight image */}
                    {highlight?.highlight?.content?.image ? (
                      <div
                        className="border rounded p-2"
                        style={{ marginTop: '0.5rem' }}
                      >
                        <img
                          alt="Screenshot"
                          className="highlight__image"
                          src={highlight?.highlight?.content.image}
                        />
                        <p className="text-xs mt-2">
                          Page{' '}
                          {
                            highlight?.highlight?.position.boundingRect
                              .pageNumber
                          }
                        </p>
                      </div>
                    ) : null}
                    <p className="mt-2 text-xs">
                      {highlight?.highlight?.comment?.text}
                    </p>
                  </div>
                </Box>
              );
            })}
          </ul>
        </Tabs.Panel>

        {workflow && (
          <Tabs.Panel value="workflow">
            <div className="mt-2">{workflow}</div>
          </Tabs.Panel>
        )}
      </Tabs>
    </div>
  );
}
