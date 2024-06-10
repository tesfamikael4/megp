'use client';
import {
  useLazyGetEvidenceAttachmentQuery,
  useLazyGetTeamMembersEvalQuery,
} from '@/store/api/rfx/rfx.api';
import { ActionIcon, Box, LoadingOverlay, Text } from '@mantine/core';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import { IconFile, IconUsers } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const PreviewDocument = () => {
  const [page, setPage] = useState<'teamAssessment' | 'documentPreview'>(
    'documentPreview',
  );
  const [getTeamAssessment, { isLoading }] = useLazyGetTeamMembersEvalQuery();

  const { id, bidderId, requirmentId, assessmentMode } = useParams();
  const [title, setTitle] = useState('');
  const [teamMembersAssessment, setTeamMembersAssessment] = useState([]);
  const [getAttachedEvidence, { isLoading: isGettingAttachemnt }] =
    useLazyGetEvidenceAttachmentQuery();

  const getTeamResult = async () => {
    try {
      const res = await getTeamAssessment({
        bidderId: bidderId.toString(),
        rfxDocumentaryEvidenceId: requirmentId.toString(),
      }).unwrap();

      const temp = res.map((e) => ({
        name: e.teamMember.personnelName,
        assessment: e.qualified,
        remark: e.remark === '' ? 'N/A' : e.remark,
      }));
      setTeamMembersAssessment(temp);
    } catch (err: any) {
      logger.log(err?.data?.message);
    }
  };

  useEffect(() => {
    page == 'teamAssessment' && getTeamResult();
  }, [page]);

  useEffect(() => {
    const getAttachment = async () => {
      try {
        const res = await getAttachedEvidence({
          rfxId: id.toString(),
          bidderId: bidderId.toString(),
          rfxDocumentaryEvidenceId: requirmentId.toString(),
        }).unwrap();
        setTitle(res.documentTitle);
      } catch {
        logger.log('err');
      }
    };

    getAttachment();
  }, [requirmentId]);

  return (
    <Section
      title={title}
      collapsible={false}
      className="h-full overflow-scroll"
      action={
        assessmentMode == 'team' ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              if (page === 'documentPreview') {
                setPage('teamAssessment');
              } else {
                setPage('documentPreview');
              }
            }}
          >
            {page === 'teamAssessment' ? (
              <IconFile size={16} />
            ) : (
              <IconUsers size={16} />
            )}
          </ActionIcon>
        ) : null
      }
    >
      {page == 'documentPreview' ? (
        <embed
          src={'https://arxiv.org/pdf/2405.19374'}
          type="application/pdf"
          width="100%"
          height="400px"
        />
      ) : (
        <Box pos="relative">
          <LoadingOverlay visible={isGettingAttachemnt} />
          <Text className="text-center my-2 font-semibold">
            Team Members Assessment
          </Text>
          <ExpandableTable
            config={{
              minHeight: 50,
              isLoading,
              columns: [
                {
                  accessor: 'name',
                  title: 'Evaluator Name',
                },
                {
                  accessor: 'assessment',
                },
                {
                  accessor: 'remark',
                },
              ],
            }}
            data={teamMembersAssessment}
          />
        </Box>
      )}
    </Section>
  );
};
