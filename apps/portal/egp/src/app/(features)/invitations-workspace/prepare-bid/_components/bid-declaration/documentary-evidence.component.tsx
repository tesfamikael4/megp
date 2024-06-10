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
import {
  useLazyGetDocumentaryEvidencesQuery,
  useLazyGetUploadedEvidencesQuery,
  useUploadDocumentaryEvidenceMutation,
} from '../../../_api/items.api';
import { useParams } from 'next/navigation';
import { IconDeviceFloppy, IconPaperclip, IconPdf } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const DocumentaryEvidence = () => {
  const [files, setFiles] = useState<any>([]);
  function onFileChange(file: File | null, rfxDocumentaryEvidenceId: string) {
    const filteredFiles = files.filter(
      (fileItem: any) => fileItem?.id !== rfxDocumentaryEvidenceId,
    );
    setFiles([
      ...filteredFiles,
      {
        rfxDocumentaryEvidenceId,
        fileInfo: { originalname: file?.name, contentType: file?.type },
      },
    ]);
    const filteredUploadedFiles = uploadedFiles.filter(
      (file: any) =>
        file?.originalArgs?.rfxDoumentaryEvidenceId !==
        rfxDocumentaryEvidenceId,
    );
    setUploadedFiles([
      ...filteredUploadedFiles,
      {
        data: { fileInfo: { originalname: file?.name } },
        originalArgs: { rfxDoumentaryEvidenceId: rfxDocumentaryEvidenceId },
      },
    ]);
  }

  const { rfxId } = useParams();

  const [
    getDocumentaryEvidences,
    { data: documentaryEvidences, isLoading: isGettingEvidences },
  ] = useLazyGetDocumentaryEvidencesQuery();
  const [uploadEvidences, { isLoading: isUploadingEvidences }] =
    useUploadDocumentaryEvidenceMutation();
  const [getUploadedEvidences, { isLoading: isGettingUploadedEvidences }] =
    useLazyGetUploadedEvidencesQuery();
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  useEffect(() => {
    getDocumentaryEvidences({
      id: rfxId?.toString() ?? '',
      collectionQuery: {},
    });
  }, [rfxId]);

  const uploadDocumentaryEvidences = async () => {
    try {
      await uploadEvidences({ rfxId, responses: files }).unwrap();
      notifications.show({
        title: 'Documentary Evidences',
        message: 'Documentary evidences uploaded successfully',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err?.data?.message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    const fetchUploadedEvidences = async () => {
      if (documentaryEvidences) {
        const results = await Promise.all(
          documentaryEvidences?.items?.map((evidence) =>
            getUploadedEvidences({
              rfxId: rfxId.toString(),
              rfxDoumentaryEvidenceId: evidence.id,
            }),
          ),
        );
        setUploadedFiles(results);
      }
    };

    fetchUploadedEvidences();
  }, [rfxId, documentaryEvidences]);

  logger.log(files);
  logger.log(documentaryEvidences?.items);
  logger.log(uploadedFiles);

  return (
    <>
      <Section title="Attach Documentary Evidence" defaultCollapsed={false}>
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
                        onFileChange(event, evidence.id);
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
                    <Flex className="justify-center">
                      <IconPaperclip />
                      {
                        uploadedFiles?.find(
                          (file: any) =>
                            file?.originalArgs?.rfxDoumentaryEvidenceId ===
                            evidence.id,
                        )?.data?.fileInfo?.originalname
                      }
                    </Flex>
                  </Paper>
                </Flex>
              ))}
            </Flex>
          </Box>
          <Button
            leftSection={<IconDeviceFloppy />}
            className="ml-auto"
            onClick={uploadDocumentaryEvidences}
            loading={isUploadingEvidences}
          >
            Upload Files
          </Button>
        </Stack>
      </Section>
    </>
  );
};

export default DocumentaryEvidence;
