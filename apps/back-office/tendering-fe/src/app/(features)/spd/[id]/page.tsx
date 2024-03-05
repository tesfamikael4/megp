'use client';
import {
  Box,
  Container,
  Text,
  useCombobox,
  Tooltip,
  Flex,
  LoadingOverlay,
  Button,
} from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconChevronLeft } from '@tabler/icons-react';
import UploadTemplate from '../_components/upload-template';
import SpdAdministrativeCompliance from '../_components/administrative-compliance';
import SpdQualification from '../_components/qualification';
import { FormDetail } from '../_components/form-detail';
import SpdPreferenceMargin from '../_components/preference-margin';
import SpdTechnicalScoring from '../_components/technical-scoring';
import SpdProfessionalSetting from '../_components/professional-setting';
import BidForm from '../_components/bid-form';
import { useReadQuery } from '../_api/spd.api';
import { Section } from '@megp/core-fe';
import ContractForm from '../_components/contract-form';
export default function SpdDetailPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('definition');
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { id } = useParams();
  const { data: selected, isLoading } = useReadQuery(id?.toString());

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <div className="bg-white -mt-4 -mr-4 -ml-4">
        <div className="container mx-auto ">
          <div className="pt-10 pb-10 text-black font-bold text-2xl flex justify-between">
            <Tooltip
              label="List of standard procurement document"
              className="cursor-pointer"
              onClick={() => router.push(`/spd`)}
              position="top-start"
            >
              <Flex align="center">
                <IconChevronLeft />
                {selected?.name}
              </Flex>
            </Tooltip>
            <div className="flex space-x-4">
              <Button variant="filled" className="my-auto">
                Activate
              </Button>
            </div>
          </div>
          <div className="flex">
            <div>
              <div className="flex space-x-4">
                <Text
                  className={
                    currentTab === 'definition'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('definition');
                  }}
                >
                  Definition
                </Text>
                <Text
                  className={
                    currentTab === 'template'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('template');
                  }}
                >
                  Template
                </Text>
                <Text
                  className={
                    currentTab === 'bid-form'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('bid-form');
                  }}
                >
                  Bid Form
                </Text>
                <Text
                  className={
                    currentTab === 'contract-form'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('contract-form');
                  }}
                >
                  Contract Form
                </Text>
                <Text
                  className={
                    currentTab === 'evaluation-criteria'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    setCurrentTab('evaluation-criteria');
                  }}
                >
                  Evaluation criteria
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">
        <Container fluid>
          {currentTab === 'definition' && (
            <>
              <Section
                title="Standard procurement document detail"
                collapsible={false}
                className="capitalize my-2"
              >
                <FormDetail mode="detail" />
              </Section>
            </>
          )}
          {currentTab === 'template' && (
            <>
              <Section
                title="Template"
                collapsible={false}
                className="capitalize my-2"
              >
                <UploadTemplate />
              </Section>
            </>
          )}
          {currentTab === 'bid-form' && (
            <>
              <BidForm spdId={selected.id} />
            </>
          )}
          {currentTab === 'contract-form' && (
            <>
              <ContractForm spdId={selected.id} />
            </>
          )}
          {currentTab === 'evaluation-criteria' && (
            <>
              <div className="text-lg font-medium mt-4 pt-4 pb-4">
                Preliminary Examination
              </div>
              <div className="pt-2">
                <SpdAdministrativeCompliance type="technical" />
              </div>
              <div className="pt-2">
                <SpdAdministrativeCompliance type="financial" />
              </div>
              <div className="text-lg font-medium mt-4 pt-4 pb-4">
                Qualification
              </div>
              <div className="pt-2">
                <SpdQualification type="legal" />
              </div>
              <div className="pt-2">
                <SpdQualification type="professional" />
              </div>
              <div className="pt-2">
                <SpdQualification type="technical" />
              </div>
              <div className="pt-2">
                <SpdQualification type="financial" />
              </div>
              <div className="pt-2">
                <SpdQualification type="performance" />
              </div>
              <div className="text-lg font-medium mt-4 pt-4 pb-4">
                Preference Margin
              </div>
              <SpdPreferenceMargin />
              <div className="text-lg font-medium mt-4 pt-4 pb-4">
                Technical Evaluation
              </div>
              <SpdTechnicalScoring />
              <div className="pt-2">
                <SpdProfessionalSetting />
              </div>
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
