'use client';

import type { ReactElement } from 'react';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { IHighlight } from 'react-pdf-highlighter';
import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight,
} from 'react-pdf-highlighter';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Text,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDownload,
  IconMinus,
  IconPlus,
  IconPrinter,
} from '@tabler/icons-react';
import { Sidebar } from './pdf-highlighter-sidebar';
import { logger, notify } from '@megp/core-fe';
import { useCreateMutation, useListQuery } from '../(app)/_api/note.api';
const getNextId = (): string => String(Math.random()).slice(2);

const parseIdFromHash = (): string => {
  return document.location.hash.slice('#highlight-'.length);
};

const resetHash = (): void => {
  document.location.hash = '';
};

function HighlightPopup({
  comment,
}: {
  comment: { text: string; emoji: string };
}): ReactElement | null {
  return comment.text ? (
    <Box className="bg-white p-5 border w-[30vw]">
      <p className="text-sm line-clamp-3">{comment.text}</p>
    </Box>
  ) : null;
}

export function PDFHighlighter({
  pdfUrl,
  objectId,
  title,
}: {
  pdfUrl: string;
  objectId: string;
  title: string;
}): ReactElement {
  const [create] = useCreateMutation();
  const { data } = useListQuery({
    where: [
      [{ column: 'objectId', value: objectId, operator: '=' }],
      [{ column: 'key', value: 'comment', operator: '=' }],
    ],
  });
  const scrollToRef = useRef<((highlight: IHighlight) => void) | undefined>(
    undefined,
  );
  const getHighlightById = (id: string): IHighlight | undefined => {
    const highlights =
      data?.items.map((highlight) => ({
        ...highlight.metaData.highlight,
        id: highlight.id,
      })) ?? [];
    return highlights.find((highlight) => highlight.id === id);
  };
  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight && scrollToRef.current) {
      scrollToRef.current(highlight);
    }
  }, [getHighlightById, parseIdFromHash, scrollToRef]);

  useEffect(() => {
    if (window)
      window.addEventListener('hashchange', scrollToHighlightFromHash);
    return () => {
      if (window)
        window.removeEventListener('hashchange', scrollToHighlightFromHash);
    };
  }, [scrollToHighlightFromHash]);

  const highlightTransform = (
    highlight,
    index,
    setTip,
    hideTip,
    viewportToScaled,
    screenshot,
    isScrolledTo,
  ): ReactElement => {
    const isTextHighlight = !highlight.content?.image;
    const component = isTextHighlight ? (
      <Highlight
        comment={highlight.comment}
        isScrolledTo={isScrolledTo}
        position={highlight.position}
      />
    ) : (
      <AreaHighlight
        highlight={highlight}
        isScrolledTo={isScrolledTo}
        onChange={(boundingRect) => {
          logger.log({ boundingRect });
        }}
      />
    );
    return (
      <Popup
        key={index}
        onMouseOut={hideTip}
        onMouseOver={(popupContent) => setTip(highlight, () => popupContent)}
        popupContent={<HighlightPopup {...highlight} />}
      >
        {component}
      </Popup>
    );
  };

  const onSelectionFinished = (
    position,
    content,
    hideTipAndSelection,
    transformSelection,
  ): ReactElement => (
    <CustomTip
      onConfirm={(comment) => {
        saveComment({ content, position, comment });
        // addHighlight({ content, position, comment });
        hideTipAndSelection();
      }}
      onOpen={transformSelection}
    />
  );

  const saveComment = async (highlight) => {
    const postData = {
      objectId,
      objectType: 'document',
      content: highlight.comment.text,
      key: 'comment',
      metaData: { highlight },
    };
    try {
      await create(postData).unwrap();
      notify('Success', 'Comment saved successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  return (
    <div className="border-2 border-slate-800 rounded">
      <Flex className="bg-slate-800 p-2" justify="space-between">
        <h2 className="text-white font-semibold">{title}</h2>

        <Group gap={2}>
          <ActionIcon variant="subtle">
            <IconMinus color="white" size={16} />
          </ActionIcon>
          <Text c="white" size="sm">
            100%
          </Text>
          <ActionIcon variant="subtle">
            <IconPlus color="white" size={16} />
          </ActionIcon>
        </Group>

        <Group gap={2}>
          <ActionIcon variant="subtle">
            <IconDownload color="white" size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle">
            <IconPrinter color="white" size={16} />
          </ActionIcon>
        </Group>
      </Flex>
      <div
        className=" h-full bg-white overflow-hidden"
        style={{ display: 'flex', height: '100vh' }}
      >
        <div style={{ height: '100vh', width: '75vw', position: 'relative' }}>
          <PdfLoader beforeLoad={<Loader />} url={pdfUrl}>
            {(pdfDocument) => (
              <PdfHighlighter
                enableAreaSelection={(event) => event.altKey}
                highlightTransform={highlightTransform}
                highlights={
                  data?.items?.map(
                    (highlight) => highlight.metaData?.highlight,
                  ) ?? []
                }
                onScrollChange={resetHash}
                onSelectionFinished={onSelectionFinished}
                pdfDocument={pdfDocument}
                scrollRef={(_scrollTo) => {
                  scrollToRef.current = _scrollTo;
                }}
              />
            )}
          </PdfLoader>
        </div>
        <Sidebar
          highlights={
            data?.items?.map((highlight) => ({
              user: highlight.metaData.fullName,
              highlight: {
                ...highlight.metaData?.highlight,
                id: highlight.id,
              },
            })) ?? []
          }
        />
      </div>
    </div>
  );
}

function CustomTip({
  onConfirm,
}: {
  onOpen: () => void;
  onConfirm: (comment: { emoji: string; text: string }) => void;
}): ReactElement {
  const [displayForm, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState('');

  return (
    <div>
      {!displayForm && (
        <Button onClick={open} size="sm">
          Add Comment
        </Button>
      )}

      {displayForm ? (
        <Box className="bg-white p-5 border">
          <Textarea
            label="Comment"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="Your comment..."
            value={value}
          />
          <Group className="mt-2" justify="end">
            <Button
              disabled={value.length === 0}
              onClick={() => {
                onConfirm({ emoji: '', text: value });
                close();
              }}
              size="xs"
            >
              Save
            </Button>
          </Group>
        </Box>
      ) : null}
    </div>
  );
}
