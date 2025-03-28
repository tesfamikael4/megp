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
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { IconChevronLeft } from '@tabler/icons-react';
import UploadTemplate from '../_components/upload-template';
import SpdAdministrativeCompliance from '../_components/administrative-compliance';
import SpdQualification from '../_components/qualification';
import { FormDetail } from '../_components/form-detail';
import SpdPreferenceMargin from '../_components/preference-margin';
import SpdTechnicalScoring from '../_components/technical-scoring';
import SpdProfessionalSetting from '../_components/professional-setting';
import BidForm from '../_components/bid-form';
import { useLazyReadQuery } from '../_api/spd.api';
import { Section, notify } from '@megp/core-fe';
import ContractForm from '../_components/contract-form';
import { useApproveSpdMutation } from '../_api/approve-spd.api';
import OpeningChecklist from '../_components/openinig-checklist';
import SpdDocumentaryEvidence from '../_components/spd-documentary-evidence-list';
export default function SpdDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { id } = useParams();
  const [trigger, { data: selected, isLoading }] = useLazyReadQuery();
  const [approve, { isLoading: isChanging }] = useApproveSpdMutation();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  useEffect(() => {
    if (id) {
      trigger(id.toString());
    }
  }, [id, trigger]);
  const onApprove = () => {
    approve({ id: selected.id })
      .unwrap()
      .then(() => {
        notify('Success', 'spd approved successfully');
        trigger(id.toString());
      })
      .catch(() => {
        notify('Error', 'error while approving the spd');
      });
  };
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
              {selected &&
                (selected.isActive ? (
                  <>
                    <Button
                      variant="filled"
                      loading={isChanging}
                      className="my-auto bg-red-500"
                      onClick={() => {
                        onApprove();
                      }}
                    >
                      Deactivate
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="filled"
                      className="my-auto"
                      loading={isChanging}
                      onClick={() => {
                        onApprove();
                      }}
                    >
                      Activate
                    </Button>
                  </>
                ))}
            </div>
          </div>
          <div className="flex">
            <div>
              <div className="flex space-x-4">
                <Text
                  className={
                    searchParams.get('tab') === 'definition'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'definition' as string),
                    );
                  }}
                >
                  Definition
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'template'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'template' as string),
                    );
                  }}
                >
                  Template
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'bid-form'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'bid-form' as string),
                    );
                  }}
                >
                  Bid Form
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'contract-form'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'contract-form' as string),
                    );
                  }}
                >
                  Contract Form
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'evaluation-criteria'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString(
                          'tab',
                          'evaluation-criteria' as string,
                        ),
                    );
                  }}
                >
                  Evaluation criteria
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'opening-minutes'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'opening-minutes' as string),
                    );
                  }}
                >
                  Opening Checklists
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">
        <Container fluid>
          {searchParams.get('tab') === 'definition' && (
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
          {searchParams.get('tab') === 'template' && (
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
          {searchParams.get('tab') === 'bid-form' && selected && (
            <>
              <BidForm spdId={selected.id} />
            </>
          )}
          {searchParams.get('tab') === 'contract-form' && selected && (
            <>
              <ContractForm spdId={selected.id} />
            </>
          )}
          {searchParams.get('tab') === 'evaluation-criteria' && (
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
                Documentary Evidence
              </div>
              <div className="py-2">
                <SpdDocumentaryEvidence />
              </div>
              <div className="text-lg font-medium mt-4 pt-4 pb-4">
                Technical Evaluation
              </div>
              <SpdTechnicalScoring />
              <div className="pt-2">
                <SpdProfessionalSetting />
              </div>
            </>
          )}
          {searchParams.get('tab') === 'opening-minutes' && (
            <>
              <OpeningChecklist />
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
