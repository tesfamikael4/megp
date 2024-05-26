'use client';

import {
  useLazyGetEqcPreliminaryExaminationQuery,
  useLazyGetPreliminaryMembersAssesmentResultQuery,
} from '@/store/api/tendering/preliminary-compliance.api';
import {
  useLazyGetEqcQualificationQuery,
  useLazyGetQualificationMembersAssesmentQuery,
} from '@/store/api/tendering/technical-qualification';
import {
  useLazyGetResponsivenessMembersAssessmentResultQuery,
  useLazyGetSorTechnicalRequirementsQuery,
} from '@/store/api/tendering/technical-responsiveness.api';
import { ActionIcon, Box, LoadingOverlay, Text } from '@mantine/core';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import { IconFile, IconUsers } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const PreviewDocument = ({
  milestone,
  teamAssessment = false,
}: {
  milestone:
    | 'technicalCompliance'
    | 'technicalQualification'
    | 'technicalResponsiveness'
    | 'technicalScoring';
  teamAssessment?: boolean;
}) => {
  const [page, setPage] = useState<'teamAssessment' | 'documentPreview'>(
    'documentPreview',
  );
  const [getPreliminaryTeamAssessment, { isLoading }] =
    useLazyGetPreliminaryMembersAssesmentResultQuery();
  const [
    getQualificationTeamAssessment,
    { isLoading: isQualificationTeamAssessmentLoading },
  ] = useLazyGetQualificationMembersAssesmentQuery();
  const [
    getResponsivenessTeamAssessment,
    { isLoading: isResponsivenessTeamAssessmentLoading },
  ] = useLazyGetResponsivenessMembersAssessmentResultQuery();
  const { lotId, bidderId, requirementId, itemId } = useParams();
  const [getEqcPreliminaryExamination] =
    useLazyGetEqcPreliminaryExaminationQuery();
  const [getEqcQualification] = useLazyGetEqcQualificationQuery();
  const [getSorTechnicalRequirement] =
    useLazyGetSorTechnicalRequirementsQuery();
  const [title, setTitle] = useState('');
  const [teamMembersAssessment, setTeamMembersAssessment] = useState([]);

  const getTeamResult = async () => {
    try {
      if (milestone === 'technicalCompliance') {
        const res = await getPreliminaryTeamAssessment({
          lotId,
          bidderId,
          requirementId,
        }).unwrap();

        const temp = res.map((e) => ({
          name: e.technicalPreliminaryAssessment.evaluatorName,
          assessment: e.qualified,
          remark: e.remark === '' ? 'N/A' : e.remark,
        }));
        setTeamMembersAssessment(temp);
      } else if (milestone === 'technicalQualification') {
        const res = await getQualificationTeamAssessment({
          lotId,
          bidderId,
          requirementId,
        }).unwrap();

        const temp = res.map((e) => ({
          name: e.technicalQualificationAssessment.evaluatorName,
          assessment: e.qualified,
          remark: e.remark === '' ? 'N/A' : e.remark,
        }));
        setTeamMembersAssessment(temp);
      } else if (milestone === 'technicalResponsiveness') {
        const res = await getResponsivenessTeamAssessment({
          lotId,
          bidderId,
          requirementId,
          itemId,
        }).unwrap();

        const temp = res.map((e) => ({
          name: e.technicalResponsivenessAssessment.evaluatorName,
          assessment: e.qualified,
          remark: e.remark === '' ? 'N/A' : e.remark,
        }));
        setTeamMembersAssessment(temp);
      }
    } catch {
      logger.log('err');
    }
  };

  const getTitle = async () => {
    try {
      if (milestone === 'technicalCompliance') {
        const res = await getEqcPreliminaryExamination(requirementId).unwrap();
        setTitle(res.itbDescription);
      } else if (milestone === 'technicalQualification') {
        const res = await getEqcQualification(requirementId).unwrap();
        setTitle(res.itbDescription);
      } else if (milestone === 'technicalResponsiveness') {
        const res = await getSorTechnicalRequirement(requirementId).unwrap();
        setTitle(res.requirement);
      }
    } catch (err) {
      logger.log({ err });
    }
  };
  useEffect(() => {
    getTitle();
    teamAssessment && getTeamResult();
  }, []);
  return (
    <Section
      title={title}
      collapsible={false}
      className="h-full overflow-scroll"
      action={
        teamAssessment ? (
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
          src={'https://arxiv.org/pdf/1708.08021'}
          type="application/pdf"
          width="100%"
          height="400px"
        />
      ) : (
        <Box pos="relative">
          <LoadingOverlay
            visible={
              isLoading ||
              isQualificationTeamAssessmentLoading ||
              isResponsivenessTeamAssessmentLoading
            }
          />
          <Text className="text-center my-2 font-semibold">
            Team Members Assessment
          </Text>
          <ExpandableTable
            config={{
              minHeight: 50,
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
