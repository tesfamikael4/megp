'use client';
import {
  Box,
  Button,
  FileButton,
  Flex,
  LoadingOverlay,
  Paper,
  Stack,
} from '@mantine/core';
import { Section, logger } from '@megp/core-fe';
import React, { useEffect, useState } from 'react';
import { useLazyGetDocumentaryEvidencesQuery } from '../../../_api/items.api';
import { useParams } from 'next/navigation';
import { IconDeviceFloppy, IconPdf } from '@tabler/icons-react';

const DocumentaryEvidence = () => {
  const [file, setFile] = useState<{ [key: string]: File | null }>({});
  function onFileChange(file: File | null, key: string) {
    const value = { [key]: file };
    setFile(value);
  }

  const { rfxId } = useParams();

  const [
    getDocumentaryEvidences,
    { data: documentaryEvidences, isLoading: isGettingEvidences },
  ] = useLazyGetDocumentaryEvidencesQuery();

  // const documentaryEvidences = [
  //   {
  //     title: 'Document 1',
  //     description: 'This is a description of document 1',
  //     key: 'document-1',
  //   },
  //   {
  //     title: 'Document 2',
  //     descripition: 'This is a description of document 2',
  //     key: 'document-2',
  //   },
  //   {
  //     title: 'Document 3',
  //     description: 'This is a description of document 3',
  //     key: 'document-3',
  //   },
  //   {
  //     title: 'Document 4',
  //     description: 'This is a description of document 4',
  //     key: 'document-4',
  //   },
  // ];

  useEffect(() => {
    getDocumentaryEvidences({
      id: rfxId?.toString() ?? '',
      collectionQuery: {},
    });
  }, [rfxId]);

  logger.log();

  return (
    <>
      <Section title="Attach Documentary Evidence" defaultCollapsed={true}>
        <Stack>
          <Box className="w-full">
            <LoadingOverlay visible={isGettingEvidences} />
            <Flex
              direction="column"
              className="border-t border-l border-r border-gray-400"
            >
              {documentaryEvidences?.items?.map((evidence, index) => (
                <Flex
                  key={index}
                  className="border-b border-gray-400 cursor-pointer group"
                >
                  <Flex className="w-1/4 p-2 bg-slate-200 flex-col">
                    <Box className=" font-semibold ">
                      {evidence?.documentTitle}
                    </Box>
                    <Box className="text-sm font-light">
                      {evidence?.description}
                    </Box>
                  </Flex>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                    <FileButton
                      onChange={(event) => {
                        onFileChange(event, evidence.key);
                      }}
                      accept=".pdf"
                    >
                      {(props) => (
                        <Button {...props} variant="subtle">
                          Select
                        </Button>
                      )}
                    </FileButton>
                  </Box>
                  <Paper withBorder className="rounded-sm">
                    <Flex>
                      <IconPdf />
                      {}
                    </Flex>
                  </Paper>
                </Flex>
              ))}
            </Flex>
          </Box>
          <Button leftSection={<IconDeviceFloppy />} className="ml-auto">
            Upload Files
          </Button>
        </Stack>
      </Section>
    </>
  );
};

export default DocumentaryEvidence;
