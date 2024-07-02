'use client';

import { useParams } from 'next/navigation';
import { PDFHighlighter } from '../../../_components/pdf-highlighter';
import { WorkflowHandling } from '../../../approval/_components/workflow';
import { LotOverview } from '@/app/(features)/evaluation/_components/lot-overview';
import { useLazyGetLotDetailQuery } from '@/store/api/tendering/tendering.api';
import { useEffect, useState } from 'react';

enum WORKFLOWKEY {
  FinalEndorsement = 'FinancialEndorsementApproval',
  TechnicalEndorsement = 'TechnicalEndorsementApproval',
}

export default function EvaluationEndorsement() {
  const { lotId, tenderId } = useParams();
  const [getLot] = useLazyGetLotDetailQuery();
  const [workflowKey, setWorkflowKey] = useState<string>('');

  useEffect(() => {
    const getLotDetail = async () => {
      const res = await getLot({
        tenderId: tenderId as string,
        lotId: lotId as string,
      }).unwrap();
      setWorkflowKey(
        WORKFLOWKEY[res?.lots?.[0]?.tenderMilestones?.[0]?.milestoneTxt],
      );
    };
    getLotDetail();
  }, [lotId, tenderId]);

  return (
    <>
      <LotOverview
        milestone="financial"
        basePath="/evaluation-endorsement"
        hideComplete
      />
      <div className="mt-2">
        {workflowKey !== '' && (
          <PDFHighlighter
            title="Lot 1"
            objectId={lotId as string}
            pdfUrl={'https://arxiv.org/pdf/1708.08021'}
            workflow={
              <WorkflowHandling
                itemId={lotId as string}
                itemKey={workflowKey}
              />
            }
          />
        )}
      </div>
    </>
  );
}
