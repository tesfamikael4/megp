import { ActionIcon, Alert, Box, Menu } from '@mantine/core';
import { IconChevronDown, IconTrash } from '@tabler/icons-react';
import type { ReactElement } from 'react';
import React from 'react';
import type { IHighlight } from 'react-pdf-highlighter';

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
}: {
  highlights: { highlight: IHighlight; user: string }[];
}): ReactElement {
  return (
    <div className="p-5 border-r" style={{ width: '25vw' }}>
      <div className="description" style={{ padding: '1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Comments</h2>
      </div>

      <ul className="overflow-y-scroll mostly-customized-scrollbar  h-full pb-10 ">
        {highlights.map((highlight, index) => (
          <Box
            className="mb-2"
            key={index}
            onClick={() => {
              updateHash(highlight.highlight);
            }}
          >
            <div className="border rounded p-2 mr-5 mb-2 cursor-pointer bg-white">
              <p className="border-l-4 px-2 border-[rgb(77,74,184)] font-semibold text-sm flex justify-between">
                {highlight?.user}
                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="subtle">
                      <IconChevronDown color="gray" size={14} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </p>
              {highlight?.highlight?.content?.text ? (
                <Alert className=" ml-2 mt-2 border-l-4 border-[rgb(77,74,184)]">
                  <p className="text-xs line-clamp-3">
                    {highlight?.highlight.content.text}
                  </p>

                  <p className="text-xs mt-2">
                    Page {highlight?.highlight.position.boundingRect.pageNumber}
                  </p>
                </Alert>
              ) : null}
              <p className="mt-2 text-xs">
                {highlight?.highlight?.comment?.text}
              </p>
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
                    {highlight?.highlight?.position.boundingRect.pageNumber}
                  </p>
                </div>
              ) : null}
            </div>
          </Box>
        ))}
      </ul>
    </div>
  );
}
