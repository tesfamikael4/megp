'use client';

import { useParams } from 'next/navigation';
import { PDFHighlighter } from '../../_components/pdf-highlighter';
import { WorkflowHandling } from '../../approval/_components/workflow';

export default function EvaluationEndorsement() {
  const { lotId } = useParams();
  return (
    <>
      <PDFHighlighter
        title="Lot 1"
        objectId={lotId as string}
        pdfUrl={'https://arxiv.org/pdf/1708.08021'}
        workflow={
          <WorkflowHandling
            itemId={lotId as string}
            itemKey={'TechnicalEndorsement'}
          />
        }
      />
    </>
  );
}
