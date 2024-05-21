import { FileViewer } from '@/app/(features)/_components/file-viewer';
import {
  useLazyGetDocumentaryEvidenceBidResponseQuery,
  useLazyGetDocumentaryEvidenceQuery,
  useLazyGetPresignedUrlQuery,
  usePreSignedUrlMutation,
} from '@/app/(features)/tender-workspace/_api/documentary-evidence-bid-response.api';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import type { DocumentaryEvidence } from '@/models/tender/lot/documentary-evidence.model';
import {
  Box,
  Button,
  FileButton,
  FileInput,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Section, logger, notify } from '@megp/core-fe';
import { IconUpload } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

const DocumentaryEvidence = () => {
  const [file, setFile] = useState<{ [key: string]: File | null }>({});
  function onFileChange(file: File | null, key: string) {
    const value = { [key]: file };

    setFile(value);
  }
  const [de, setDe] = useState<DocumentaryEvidence | null>(null);
  const [deResponse, setDeResponse] = useState<DocumentaryEvidence | null>(
    null,
  );
  const [trigger, { data, isLoading: isFetching }] =
    useLazyGetDocumentaryEvidenceQuery();
  const [triggerPdf, { data: response, isLoading: isResponseFetching }] =
    useLazyGetDocumentaryEvidenceBidResponseQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [retrieveNewURL] = usePreSignedUrlMutation();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const prepareBidContext = useContext(PrepareBidContext);
  useEffect(() => {
    if (searchParams.get('lot') && prepareBidContext) {
      trigger({
        lotId: searchParams.get('lot'),
        collectionQuery: {
          skip: 0,
          limit: 10,
        },
      });
      triggerPdf({
        lotId: searchParams.get('lot'),
        documentType: prepareBidContext?.documentType,
        password: prepareBidContext?.password,
      });
    }
  }, [prepareBidContext, searchParams, trigger, triggerPdf]);
  const onSubmit = async (files, id) => {
    try {
      setIsLoading(true);
      await upload({ files, id });
    } catch (error) {
      setIsLoading(false);
      logger.log(error);
    }
  };
  const upload = async (args: { files: FileList | null; id: string }) => {
    if (!args.files) {
      setIsLoading(false);
      notify('Error', 'No file selected');
      return;
    }

    const fileList = Array.from(args.files); // Convert FileList to Array
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const url = await retrieveNewURL({
          value: {
            originalname: file.name,
            contentType: file.type,
          },
          lotId: searchParams.get('lot'),
          eqcDocumentaryEvidenceId: args.id,
          documentType: prepareBidContext?.documentType,
          password: prepareBidContext?.password,
        }).unwrap();
        await uploadFile(file, url.presignedDownload);
      } catch (error) {
        setIsLoading(false);
        notify(
          'Error',
          'Something went wrong while uploading documentary evidence',
        );
      }
    }
  };
  const uploadFile = async (file: File, url: string) => {
    try {
      await fetch(url, {
        method: 'PUT',
        body: file,
      });
      notify('Success', 'Documentary Evidence Uploaded Successfully');
      setIsLoading(false);
      triggerPdf({
        lotId: searchParams.get('lot'),
        documentType: prepareBidContext?.documentType,
        password: prepareBidContext?.password,
      });
      close();
    } catch (error) {
      setIsLoading(false);
      notify(
        'Error',
        'Something went wrong while uploading documentary evidence',
      );
      throw error;
    }
  };
  return (
    <>
      <LoadingOverlay visible={isFetching || isResponseFetching} />
      <Section title="Documentary Evidence" defaultCollapsed={true}>
        <Box className="w-full">
          <Flex
            direction="column"
            className="border-t border-l border-r border-gray-400"
          >
            {data &&
              data.items.map((docEvidence) => (
                <Flex
                  key={docEvidence.id}
                  className="border-b border-gray-400 cursor-pointer group"
                >
                  <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                    <Box className="text-lg font-semibold">
                      {docEvidence.evidenceTitle}
                    </Box>
                    <Box className="text-sm font-thin">
                      {docEvidence.evidenceType}
                    </Box>
                  </Box>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                    <Group gap="md">
                      <FileInput
                        accept=".pdf"
                        multiple
                        className="my-2"
                        leftSection={<IconUpload />}
                        onChange={(files) => onSubmit(files, docEvidence.id)}
                      />
                      <Button
                        variant="outline"
                        onClick={close}
                        disabled={isLoading}
                      >
                        Close
                      </Button>
                      {response &&
                        response.find(
                          (res) =>
                            res.eqcDocumentaryEvidenceId === docEvidence.id,
                        ) && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              open();
                              setDe(de);
                              setDeResponse(
                                response.find(
                                  (res) =>
                                    res.eqcDocumentaryEvidenceId ===
                                    docEvidence.id,
                                ),
                              );
                            }}
                            disabled={isLoading}
                          >
                            Preview
                          </Button>
                        )}
                    </Group>
                  </Box>
                </Flex>
              ))}
          </Flex>
        </Box>
        <Modal title={de?.id} opened={opened} onClose={close} size="xl">
          <FilePreview id={deResponse?.id as any} name={de?.evidenceTitle} />
        </Modal>
      </Section>
    </>
  );
};

export default DocumentaryEvidence;

const FilePreview = ({ id, name }) => {
  const [dowloadFile, { data: url, isLoading }] = useLazyGetPresignedUrlQuery();
  const prepareBidContext = useContext(PrepareBidContext);

  useEffect(() => {
    dowloadFile({ id: id, password: prepareBidContext?.password });
  }, [id, prepareBidContext, dowloadFile]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <FileViewer url={url?.presignedUrl ?? ''} filename={name} />
    </>
  );
};
