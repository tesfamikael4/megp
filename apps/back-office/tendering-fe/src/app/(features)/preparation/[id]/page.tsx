'use client';
import {
  Box,
  Container,
  Divider,
  Text,
  useCombobox,
  Tooltip,
  Flex,
  LoadingOverlay,
  Button,
  Select,
  Modal,
  FileButton,
} from '@mantine/core';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Items from '../_components/item/items';
import { IconChevronLeft, IconEdit, IconFolderOpen } from '@tabler/icons-react';
import FormDetail from '../_components/tender/form-detail';
import { Section, logger, notify } from '@megp/core-fe';
import BidProGeneral from '../_components/bidding-procedure/bid-pro-general';
import PreparationDetail from '../_components/bidding-procedure/preparation-detail';
import SubmissionDetail from '../_components/bidding-procedure/submission-detail';
import BidProEvaluation from '../_components/bidding-procedure/bid-pro-evaluation';
import BidProAwards from '../_components/bidding-procedure/bid-pro-awards';
import TechnicalTeams from '../_components/tender/technical-teams';
import ProcurementMechanismForm from '../_components/tender/procurement-mechanism-form';
import { useLazyReadQuery } from '../_api/tender/tender.api';
import { useLazyListByIdQuery } from '../_api/tender/lot.api';
import TenderConfigSpd from '../_components/tender/tender-config-spd';
import PreliminaryExamination from '../_components/lot/evaluation-criteria/preliminary-examination/preliminary-examination';
import Qualification from '../_components/lot/evaluation-criteria/qualification/qualification';
import TechnicalScoring from '../_components/lot/evaluation-criteria/technical-scoring/technical-scoring';
import BidSecurity from '../_components/lot/bid-security/bid-security';
import { useDisclosure } from '@mantine/hooks';
import SplitTenderModal from '../_components/lot/split-tender-modal';
import ContractConditionTab from '../_components/contact-condition/contract-condition-tab';
import Classification from '../_components/tender/invitation/classification/classification';
import ParticipationFee from '../_components/tender/invitation/participation-fee';
import {
  useLazyGetBdsFilesQuery,
  useLazyGetSccFilesQuery,
  useUploadBdsTemplateMutation,
  useUploadSccTemplateMutation,
} from '../_api/tender/tender-template.api';
import TenderPersonnelList from '../_components/tender/tender-personnel-list';
import DocumentaryEvidence from '../_components/lot/evaluation-criteria/documentery-evidence/documentary-evidence';
import {
  useApproveTenderMutation,
  useGenerateBidMutation,
} from '../_api/tender/approve-tender.api';
import { TenderStatusEnum } from '@/models/tender/tender.model';
import Document from '../_components/tender/document';
import { LotFormDetail } from '../_components/lot/lot-form-detail';
import InvitationDocument from '../_components/tender/invitation/invitation-document';
export default function TenderDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [updateLot, { open: openUpdateLot, close: closeUpdateLot }] =
    useDisclosure(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState<any>(null);
  const { id } = useParams();
  const [triggerDetail, { data: selected, isLoading }] = useLazyReadQuery();
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [update, { isLoading: isUpdating }] = useApproveTenderMutation();
  const [generate, { isLoading: isGenerating }] = useGenerateBidMutation();
  const [uploadBdsFile, { isLoading: isBdsUploading }] =
    useUploadBdsTemplateMutation();
  const [uploadSccFile, { isLoading: isSccUploading }] =
    useUploadSccTemplateMutation();
  const [downloadBdsFile, { data: downloadBds, isLoading: isBdsLoading }] =
    useLazyGetBdsFilesQuery();
  const [downloadSccFile, { data: downloadScc, isLoading: isSccLoading }] =
    useLazyGetSccFilesQuery();
  const [file, setFile] = useState<{ [key: string]: File | null }>({});
  useEffect(() => {
    if (selected) {
      trigger({ id: selected.id, collectionQuery: { skip: 0, take: 10 } });
      downloadBdsFile(selected.id);
      downloadSccFile(selected.id);
    }
  }, [downloadBdsFile, downloadSccFile, selected, trigger]);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  async function onUploadBds(type: string) {
    logger.log(file);
    const formData = new FormData();
    formData.append('file', file?.[type] ?? '');
    uploadBdsFile({ id: id, type: type, file: formData })
      .unwrap()
      .then(() => {
        notify('Success', 'Bid data sheet uploaded successfully');
      })
      .catch((error) => {
        notify('Error', error?.data?.message);
      });
  }
  async function onUploadScc(type: string) {
    logger.log(file);
    const formData = new FormData();
    formData.append('file', file?.[type] ?? '');
    uploadSccFile({ id: id, type: type, file: formData })
      .unwrap()
      .then(() => {
        notify(
          'Success',
          'Special condition of contract uploaded successfully',
        );
      })
      .catch((error) => {
        notify('Error', error?.data?.message);
      });
  }
  function onFileChange(file: File | null, key: string) {
    const value = { [key]: file };
    setFile(value);
  }
  const onUpdate = (data) => {
    update({ ...data, id: id?.toString() })
      .unwrap()
      .then(() => {
        triggerDetail(id.toString());
        router.push(pathname + '?' + createQueryString('tab', 'document'));
        notify('Success', 'Tendering Updated successfully');
      })
      .catch((error) => {
        notify('Error', error?.data?.message);
      });
  };
  const onGenerate = () => {
    generate({ id: id?.toString() })
      .unwrap()
      .then(() => {
        notify('Success', 'Tender document generated successfully');
        triggerDetail(id.toString());
      })
      .catch((error) => {
        if (error?.data?.message === 'bds_not_found') {
          notify(
            'Error',
            `You didn't attach bid data sheet to the document please try again`,
          );
        }
        if (error?.data?.message === 'scc_not_found') {
          notify(
            'Error',
            `You didn't attach special condition of contract to the document please try again`,
          );
        }
      });
  };
  useEffect(() => {
    if (id) {
      triggerDetail(id?.toString());
    }
  }, [id, triggerDetail]);
  return (
    <>
      <LoadingOverlay visible={isLoading || isBdsLoading || isSccLoading} />
      <div className="bg-white -mt-4 -mr-4 -ml-4">
        <div className="container mx-auto ">
          <div className="pt-10 pb-10 text-black font-bold text-2xl flex justify-between">
            <Tooltip
              label="List of Tenders"
              className="cursor-pointer"
              onClick={() => router.push(`/preparation`)}
              position="top-start"
            >
              <Flex align="center">
                <IconChevronLeft />
                {selected?.name}
              </Flex>
            </Tooltip>
            <Box className="flex space-x-4">
              {selected?.status === TenderStatusEnum.SUBMITTED && (
                <Button
                  variant="filled"
                  className="my-auto"
                  loading={isUpdating && currentStatus === 'draft'}
                  onClick={() => {
                    setCurrentStatus('draft');
                    onUpdate({
                      status: 'DRAFT',
                    });
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'configuration'),
                    );
                  }}
                >
                  Back to Draft
                </Button>
              )}
              {selected?.status !== TenderStatusEnum.PUBLISHED &&
                ((selected?.tenderDocument &&
                  selected?.status === TenderStatusEnum.SUBMITTED) ||
                  selected?.status === TenderStatusEnum.DRAFT) && (
                  <Button
                    variant="filled"
                    className="my-auto"
                    loading={isUpdating && currentStatus === 'submitted'}
                    onClick={() => {
                      setCurrentStatus('submitted');
                      onUpdate({
                        status:
                          selected.status === TenderStatusEnum.SUBMITTED
                            ? TenderStatusEnum.SENT_FOR_REVIEW
                            : TenderStatusEnum.SUBMITTED,
                      });
                    }}
                  >
                    {selected?.status === TenderStatusEnum.DRAFT
                      ? 'Submit to review'
                      : 'Send for review'}
                  </Button>
                )}
              {selected?.status === TenderStatusEnum.REVIEWED && (
                <>
                  <Button
                    variant="filled"
                    className="my-auto"
                    loading={isUpdating && currentStatus === 'draft'}
                    onClick={() => {
                      setCurrentStatus('draft');
                      onUpdate({
                        status: TenderStatusEnum.DRAFT,
                      });
                    }}
                  >
                    Back to Draft
                  </Button>
                  <Button
                    variant="filled"
                    className="my-auto"
                    loading={isUpdating && currentStatus === 'approval'}
                    onClick={() => {
                      setCurrentStatus('approval');
                      onUpdate({
                        status: TenderStatusEnum.APPROVAL,
                      });
                    }}
                  >
                    Sent for Approval
                  </Button>
                </>
              )}
              {selected?.status === TenderStatusEnum.APPROVED && (
                <>
                  <Button
                    variant="filled"
                    className="my-auto"
                    loading={isUpdating && currentStatus === 'publish'}
                    onClick={() => {
                      setCurrentStatus('publish');
                      onUpdate({
                        status: TenderStatusEnum.PUBLISHED,
                      });
                    }}
                  >
                    Publish
                  </Button>
                </>
              )}
              {selected?.status !== TenderStatusEnum.DRAFT && (
                <Button
                  variant="filled"
                  className="my-auto"
                  loading={isGenerating}
                  onClick={() => {
                    onGenerate();
                  }}
                >
                  {selected?.tenderDocument ? 'Regenerate' : 'Generate'}
                </Button>
              )}
            </Box>
          </div>
          <div className="flex">
            <div>
              {selected?.status === TenderStatusEnum.DRAFT ? (
                <div className="flex space-x-4">
                  <Text
                    className={
                      searchParams.get('tab') === 'configuration'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname +
                          '?' +
                          createQueryString('tab', 'configuration'),
                      );
                    }}
                  >
                    Configuration
                  </Text>
                  <Text
                    className={
                      searchParams.get('tab') === 'item'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname + '?' + createQueryString('tab', 'item'),
                      );
                    }}
                  >
                    Items
                  </Text>
                  <Text
                    className={
                      searchParams.get('tab') === 'bidding-procedure'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname +
                          '?' +
                          createQueryString('tab', 'bidding-procedure'),
                      );
                    }}
                  >
                    Bidding procedure
                  </Text>
                  <Text
                    className={
                      searchParams.get('tab') === 'criteria'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname + '?' + createQueryString('tab', 'criteria'),
                      );
                    }}
                  >
                    Evaluation criteria
                  </Text>
                  <Text
                    className={
                      searchParams.get('tab') === 'condition'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname + '?' + createQueryString('tab', 'condition'),
                      );
                    }}
                  >
                    Contract conditions
                  </Text>
                  <Text
                    className={
                      searchParams.get('tab') === 'invitation'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname + '?' + createQueryString('tab', 'invitation'),
                      );
                    }}
                  >
                    Invitation
                  </Text>
                </div>
              ) : selected?.status === TenderStatusEnum.PUBLISHED ? (
                <>
                  <div className="flex space-x-4">
                    <Text
                      className={
                        searchParams.get('tab') === 'document'
                          ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                          : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                      }
                      onClick={() => {
                        router.push(
                          pathname + '?' + createQueryString('tab', 'document'),
                        );
                      }}
                    >
                      Review
                    </Text>
                    <Text
                      className={
                        searchParams.get('tab') === 'invitation-document'
                          ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                          : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                      }
                      onClick={() => {
                        router.push(
                          pathname +
                            '?' +
                            createQueryString('tab', 'invitation-document'),
                        );
                      }}
                    >
                      Invitation
                    </Text>
                    <Text
                      className={
                        searchParams.get('tab') === 'extension'
                          ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                          : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                      }
                      onClick={() => {
                        router.push(
                          pathname +
                            '?' +
                            createQueryString('tab', 'extension'),
                        );
                      }}
                    >
                      Extension
                    </Text>
                  </div>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Text
                    className={
                      searchParams.get('tab') === 'document'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname + '?' + createQueryString('tab', 'document'),
                      );
                    }}
                  >
                    Review
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">
        {searchParams.get('tab') !== 'configuration' &&
          selected?.status === TenderStatusEnum.DRAFT && (
            <>
              <Box className="w-full flex flex-row justify-between items-center container my-2">
                <p className="text-lg font-semibold flex">
                  <Select
                    placeholder="Pick Lot"
                    data={
                      data
                        ? data.items.map((single) => {
                            const value = { ...single };
                            value['label'] = value.name;
                            value['value'] = value.id;
                            return value;
                          })
                        : []
                    }
                    onChange={setValue}
                  />
                  {value && (
                    <IconEdit
                      className="my-auto mx-3 pointer"
                      onClick={openUpdateLot}
                    />
                  )}
                </p>
                <div className="flex justify-end items-center gap-3">
                  <LoadingOverlay visible={isFetching} />
                  {value && (
                    <Button variant="filled" className="my-auto" onClick={open}>
                      Split
                    </Button>
                  )}
                  {searchParams.get('tab') === 'bidding-procedure' && (
                    <>
                      {downloadBds && (
                        <a href={downloadBds.presignedUrl} download>
                          Download template
                        </a>
                      )}
                      <FileButton
                        onChange={(event) => {
                          onFileChange(event, 'bds');
                        }}
                        accept=".docx"
                      >
                        {(props) => (
                          <Button {...props} variant="subtle">
                            Select
                          </Button>
                        )}
                      </FileButton>
                      <Button
                        variant="filled"
                        loading={isBdsUploading}
                        onClick={() => {
                          onUploadBds('bds');
                        }}
                      >
                        Upload
                      </Button>
                    </>
                  )}
                  {searchParams.get('tab') === 'condition' && (
                    <>
                      {downloadScc && (
                        <a href={downloadScc.presignedUrl} download>
                          Download template
                        </a>
                      )}
                      <FileButton
                        onChange={(event) => {
                          onFileChange(event, 'bds');
                        }}
                        accept=".docx"
                      >
                        {(props) => (
                          <Button {...props} variant="subtle">
                            Select
                          </Button>
                        )}
                      </FileButton>
                      <Button
                        variant="filled"
                        loading={isSccUploading}
                        onClick={() => {
                          onUploadScc('bds');
                        }}
                      >
                        Upload
                      </Button>
                    </>
                  )}

                  <Divider mb={'md'} />
                </div>
              </Box>
            </>
          )}
        <Container fluid>
          {searchParams.get('tab') === 'configuration' && (
            <>
              <Section
                title="Tender Detail"
                collapsible={true}
                defaultCollapsed={true}
                className="capitalize my-2"
              >
                <FormDetail />
              </Section>
              <TenderConfigSpd />
              <TenderPersonnelList />

              <TechnicalTeams />
              <Section
                title="Procurement Mechanism"
                collapsible={true}
                defaultCollapsed={true}
                className="capitalize my-2"
              >
                <ProcurementMechanismForm prId={selected?.prId} />
              </Section>
            </>
          )}
          {searchParams.get('tab') === 'item' && (
            <>
              {value ? (
                <Items lotId={value} />
              ) : (
                <div className="w-full bg-white flex flex-col h-96 justify-center items-center">
                  <IconFolderOpen className="w-32 h-16 stroke-1" />
                  <p className="text-base font-semibold">no lot selected</p>
                  <p>Please Select a lot first</p>
                </div>
              )}
            </>
          )}
          {searchParams.get('tab') === 'bidding-procedure' && (
            <div className="w-full flex flex-col gap-3">
              {value ? (
                <Section
                  title="Bid Security"
                  collapsible={true}
                  defaultCollapsed={true}
                  className="capitalize my-2"
                >
                  <BidSecurity lotId={value} />
                </Section>
              ) : (
                <>
                  <Section
                    title="General"
                    collapsible={true}
                    defaultCollapsed={true}
                    className="capitalize my-2"
                  >
                    <BidProGeneral />
                  </Section>
                  <Section
                    title="Preparation"
                    collapsible={true}
                    defaultCollapsed={true}
                    className="capitalize my-2"
                  >
                    <PreparationDetail />
                  </Section>
                  <Section
                    title="Submission"
                    collapsible={true}
                    defaultCollapsed={true}
                    className="capitalize my-2"
                  >
                    <SubmissionDetail fromExtension={false} />
                  </Section>
                  <Section
                    title="Evaluation"
                    collapsible={true}
                    defaultCollapsed={true}
                    className="capitalize my-2"
                  >
                    <BidProEvaluation />
                  </Section>
                  <Section
                    title="Award"
                    collapsible={true}
                    defaultCollapsed={true}
                    className="capitalize my-2"
                  >
                    <BidProAwards />
                  </Section>
                </>
              )}
            </div>
          )}
          {searchParams.get('tab') === 'criteria' && (
            <>
              {value ? (
                <>
                  <div className="text-lg font-medium mt-4 pt-4 pb-4">
                    Preliminary Examination
                  </div>
                  <div className="py-2">
                    <PreliminaryExamination type="technical" lotId={value} />
                  </div>
                  <div className="py-2">
                    <PreliminaryExamination type="financial" lotId={value} />
                  </div>
                  <div className="text-lg font-medium mt-4 pt-4 pb-4">
                    Qualification
                  </div>
                  <div className="py-2">
                    <Qualification lotId={value} />
                  </div>
                  <div className="text-lg font-medium mt-4 pt-4 pb-4">
                    Documentary Evidence
                  </div>
                  <div className="py-2">
                    <DocumentaryEvidence lotId={value} />
                  </div>
                  <div className="text-lg font-medium mt-4 pt-4 pb-4">
                    Technical Evaluation
                  </div>
                  <div className="py-2">
                    <TechnicalScoring lotId={value} />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full bg-white flex flex-col h-96 justify-center items-center">
                    <IconFolderOpen className="w-32 h-16 stroke-1" />
                    <p className="text-base font-semibold">no lot selected</p>
                    <p>Please Select a lot first</p>
                  </div>
                </>
              )}
            </>
          )}

          {searchParams.get('tab') === 'condition' && <ContractConditionTab />}
          {searchParams.get('tab') === 'document' && (
            <>
              {selected?.tenderDocument ? (
                <Document />
              ) : (
                <>
                  <div className="w-full bg-white flex flex-col h-96 justify-center items-center">
                    <IconFolderOpen className="w-32 h-16 stroke-1" />
                    <p className="text-base font-semibold">
                      no document generated
                    </p>
                    <p>
                      <Button
                        variant="filled"
                        className="my-auto"
                        loading={isGenerating}
                        onClick={() => {
                          onGenerate();
                        }}
                      >
                        {'Generate'}
                      </Button>
                    </p>
                  </div>
                </>
              )}
            </>
          )}
          {searchParams.get('tab') === 'invitation' && (
            <>
              <div className="text-lg font-medium mt-4 pt-4 pb-4">
                Classification
              </div>
              <Classification />
              <div className="text-lg font-medium mt-4 pt-4 pb-4">
                Participation Fee
              </div>
              <Section
                title="Participation Fee"
                collapsible={true}
                defaultCollapsed={true}
                className="capitalize my-2"
              >
                <ParticipationFee />
              </Section>
            </>
          )}
          {searchParams.get('tab') === 'invitation-document' && (
            <>
              <Section
                title="Invitation Document"
                collapsible={false}
                defaultCollapsed={false}
                className="capitalize my-2"
              >
                <InvitationDocument />
              </Section>
            </>
          )}
          {searchParams.get('tab') === 'extension' && (
            <>
              <Section
                title="Extension"
                collapsible={false}
                defaultCollapsed={false}
                className="capitalize my-2"
              >
                <SubmissionDetail fromExtension={true} />
              </Section>
            </>
          )}
        </Container>
      </Box>
      <Modal
        title="Select Items To Create A Lot"
        opened={opened}
        size={'80%'}
        onClose={close}
        withCloseButton={false}
      >
        <SplitTenderModal
          lotId={value}
          listOfLots={data ? data.items : []}
          closeModal={close}
        />
      </Modal>
      <Modal
        title="Update Lot"
        opened={updateLot}
        size={'60%'}
        onClose={closeUpdateLot}
        withCloseButton={false}
      >
        <LotFormDetail lotId={value} closeModal={close} />
      </Modal>
    </>
  );
}
