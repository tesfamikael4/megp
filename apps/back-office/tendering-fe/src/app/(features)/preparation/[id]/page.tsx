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
} from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Items from '../_components/item/items';
import { IconChevronLeft, IconFolderOpen } from '@tabler/icons-react';
import FormDetail from '../_components/tender/form-detail';
import { Section, logger, notify } from '@megp/core-fe';
import BidProGeneral from '../_components/bidding-procedure/bid-pro-general';
import PreparationDetail from '../_components/bidding-procedure/preparation-detail';
import SubmissionDetail from '../_components/bidding-procedure/submission-detail';
import BidProEvaluation from '../_components/bidding-procedure/bid-pro-evaluation';
import BidProAwards from '../_components/bidding-procedure/bid-pro-awards';
import TechnicalTeams from '../_components/tender/technical-teams';
import ProcurementMechanismForm from '../_components/tender/procurement-mechanism-form';
import { useReadQuery, useUpdateMutation } from '../_api/tender/tender.api';
import { useLazyListByIdQuery } from '../_api/tender/lot.api';
import TenderConfigSpd from '../_components/tender/tender-config-spd';
import PreliminaryExamination from '../_components/lot/evaluation-criteria/preliminary-examination/preliminary-examination';
import Qualification from '../_components/lot/evaluation-criteria/qualification/qualification';
import TechnicalScoring from '../_components/lot/evaluation-criteria/technical-scoring/technical-scoring';
import BidSecurity from '../_components/lot/bid-security/bid-security';
import { useDisclosure } from '@mantine/hooks';
import SplitTenderModal from '../_components/lot/split-tender-modal';
import ContractConditionTab from '../_components/contact-condition/contract-condition-tab';

export default function TenderDetailPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('configuration');
  const [opened, { open, close }] = useDisclosure(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<any>(null);
  const { id } = useParams();
  const { data: selected, isLoading } = useReadQuery(id?.toString());
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  useEffect(() => {
    if (selected) {
      trigger({ id: selected.id, collectionQuery: { skip: 0, take: 10 } });
    }
  }, [selected, trigger]);
  useEffect(() => {
    // logger.log(value);
  }, [value]);
  const onUpdate = (data) => {
    logger.log(data);
    update({ ...data, id: id?.toString() });
    notify('Success', 'Tendering Updated successfully');
  };
  return (
    <>
      <LoadingOverlay visible={isLoading} />
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
            <Button
              variant="filled"
              className="my-auto"
              loading={isUpdating}
              onClick={() => {
                onUpdate({
                  ...selected,
                  status: 'PUBLISHED',
                });
              }}
            >
              Publish
            </Button>
          </div>
          <div className="flex">
            <div>
              <div className="flex space-x-4">
                <Text
                  className={
                    currentTab === 'configuration'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('configuration');
                  }}
                >
                  Configuration
                </Text>
                <Text
                  className={
                    currentTab === 'item'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('item');
                  }}
                >
                  Items
                </Text>
                <Text
                  className={
                    currentTab === 'bidding-procedure'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('bidding-procedure');
                  }}
                >
                  Bidding procedure
                </Text>
                <Text
                  className={
                    currentTab === 'criteria'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('criteria');
                  }}
                >
                  Evaluation criteria
                </Text>
                <Text
                  className={
                    currentTab === 'condition'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('condition');
                  }}
                >
                  Contract conditions
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">
        {currentTab !== 'configuration' && (
          <>
            <Box className="w-full flex flex-row justify-between items-center container my-2">
              <p className="text-lg font-semibold">
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
              </p>
              <div className="flex justify-end items-center gap-3">
                <LoadingOverlay visible={isFetching} />
                {value && (
                  <Button variant="filled" className="my-auto" onClick={open}>
                    Split
                  </Button>
                )}
                {currentTab === 'bidding-procedure' && <></>}

                <Divider mb={'md'} />
              </div>
            </Box>
          </>
        )}
        <Container fluid>
          {currentTab === 'configuration' && (
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

              <TechnicalTeams />
              <Section
                title="Procurement Mechanism"
                collapsible={true}
                defaultCollapsed={true}
                className="capitalize my-2"
              >
                <ProcurementMechanismForm />
              </Section>
            </>
          )}
          {currentTab === 'item' && (
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
          {currentTab === 'bidding-procedure' && (
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
                    <SubmissionDetail />
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
          {currentTab === 'criteria' && (
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
                    <Qualification type="legal" lotId={value} />
                  </div>
                  <div className="py-2">
                    <Qualification type="professional" lotId={value} />
                  </div>
                  <div className="py-2">
                    <Qualification type="technical" lotId={value} />
                  </div>
                  <div className="py-2">
                    <Qualification type="financial" lotId={value} />
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

          {currentTab === 'condition' && <ContractConditionTab />}
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
    </>
  );
}
