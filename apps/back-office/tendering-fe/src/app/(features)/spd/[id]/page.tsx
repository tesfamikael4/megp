'use client';
import {
  Box,
  Container,
  Divider,
  Flex,
  Tabs,
  Tooltip,
  Accordion,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';
import UploadTemplate from '../_components/upload-template';
import SpdAdministrativeCompliance from '../_components/administrative-compliance';
import SpdQualification from '../_components/qualification';
import { FormDetail } from '../_components/form-detail';
import SpdDocumentaryEvidence from '../_components/documentary-evidence';
import SpdPreferenceMargin from '../_components/preference-margin';
import SpdTechnicalScoring from '../_components/technical-scoring';

export default function PrDetailPage() {
  const router = useRouter();
  return (
    <>
      <Box className="bg-white rounded shadow-sm">
        <div className="text-lg font-medium mt-4 pt-4 pb-4">
          <Tooltip
            label="List Standard Procurement Document"
            className="cursor-pointer"
            onClick={() => router.push(`/spd`)}
            position="top-start"
          >
            <Flex align="center">
              <IconChevronLeft />
              Standard procurement document details
            </Flex>
          </Tooltip>
        </div>
        <Box className="">
          <Divider mb={'md'} />
          <Container fluid>
            <Tabs defaultValue="definition" keepMounted={false}>
              <Tabs.List className=" flex-nowrap">
                <Tabs.Tab value="definition">Definition</Tabs.Tab>
                <Tabs.Tab value="documents">Templates</Tabs.Tab>

                <Tabs.Tab value="evaluationCriteria">
                  Evaluation Criteria
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="definition" className="py-4">
                <FormDetail mode="detail" />
              </Tabs.Panel>

              <Tabs.Panel value="documents" className="py-4">
                <UploadTemplate />
              </Tabs.Panel>

              <Tabs.Panel value="evaluationCriteria" className="py-4">
                <Accordion variant="filled" defaultValue="Apples">
                  <Accordion.Item
                    key="preliminary"
                    value="Preliminary Evaluation"
                  >
                    <Accordion.Control>
                      Preliminary Evaluation
                    </Accordion.Control>
                    <Accordion.Panel>
                      {
                        <>
                          <div className="pt-2">
                            <SpdAdministrativeCompliance type="technical" />
                          </div>
                          <div className="pt-2">
                            <SpdAdministrativeCompliance type="financial" />
                          </div>
                        </>
                      }
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item key="qualification" value="Qualification">
                    <Accordion.Control>Qualification</Accordion.Control>
                    <Accordion.Panel>
                      {
                        <>
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
                        </>
                      }
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item
                    key="documentary"
                    value="Documentary Evidence"
                  >
                    <Accordion.Control>Documentary Evidence</Accordion.Control>
                    <Accordion.Panel>
                      {
                        <>
                          <SpdDocumentaryEvidence />
                        </>
                      }
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item key="preference" value="Preference Margin">
                    <Accordion.Control>Preference Margin</Accordion.Control>
                    <Accordion.Panel>
                      {
                        <>
                          <SpdPreferenceMargin />
                        </>
                      }
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item
                    key="technicalEvaluation"
                    value="Technical Evaluation"
                  >
                    <Accordion.Control>Technical Evaluation</Accordion.Control>
                    <Accordion.Panel>
                      {
                        <>
                          <SpdTechnicalScoring />
                        </>
                      }
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Tabs.Panel>
            </Tabs>
          </Container>
        </Box>
      </Box>
    </>
  );
}
