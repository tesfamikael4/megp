'use client';
import { StatusContext } from '@/contexts/rfx-status.context';
import { useLazyGetCriterionWithBiddersQuery } from '@/store/api/rfx/eval-approval.api';
import { useLazyGetEvidenceAttachmentQuery } from '@/store/api/rfx/rfx.api';
import { Modal, Stack, LoadingOverlay, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable } from '@megp/core-fe';
import { IconDots } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function QualificationCriterion() {
  const [getCriterions, { data: criterion, isLoading: isFetching }] =
    useLazyGetCriterionWithBiddersQuery();
  const { id } = useParams();
  const { data: rfq } = useContext(StatusContext);
  const [
    getAttachedEvidence,
    { data: attachedEvidence, isLoading: isGettingAttachemnt },
  ] = useLazyGetEvidenceAttachmentQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const config = {
    columns: [
      {
        accessor: 'name',
        title: 'Company Name',
        render: (value) => {
          return <>{value?.solRegistration?.vendorName}</>;
        },
      },
      {
        accessor: 'qualificationAssessment',
        title: 'Qualification Assessment',
        render: (value) => (
          <>
            {value?.solRegistration?.evaluationAssessments?.[0]?.qualified ==
            'COMPLY'
              ? 'Comply'
              : 'Not Comply'}
          </>
        ),
      },
      {
        accessor: '',
        title: 'Uploaded Document',
        render: (value) => (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <IconDots />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => {
                  rfq &&
                    getAttachedEvidence({
                      rfxId: rfq?.id,
                      bidderId: value?.solRegistration?.id,
                      rfxDocumentaryEvidenceId: value?.id,
                    });
                  open();
                }}
              >
                See Document Attachement
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ),
      },
    ],
    isExpandable: false,
    isSearchable: false,
    primaryColumn: 'name',
    isLoading: isFetching,
  };

  useEffect(() => {
    getCriterions({ id: id.toString() });
  }, [id]);

  return (
    <Stack>
      {criterion?.items?.map((criteria) => (
        <Stack key={criteria.id}>
          <Modal opened={opened} onClose={close} title="Document">
            <LoadingOverlay visible={isGettingAttachemnt} />
            <embed
              src={
                attachedEvidence?.presignedUrl ??
                'https://arxiv.org/pdf/2405.19374'
              }
              type="application/pdf"
              width="100%"
              height="400px"
            />
          </Modal>
          <p className="font-medium text-md">{criteria.documentTitle}</p>
          <Stack>
            <ExpandableTable
              config={config}
              data={criteria?.openedResponses ?? []}
              total={0}
            />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
