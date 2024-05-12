'use client';
import { Section, logger } from '@megp/core-fe';
import { OpeningMinuteTemplate } from './_components/pdf-template';
import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'next/navigation';
import { useGetOpeningMinutesQuery } from '@/store/api/tendering/tender-opening.api';

export default function OpeningMinute() {
  const { id } = useParams();
  const { data } = useGetOpeningMinutesQuery(id as string);

  logger.log({ openingMinute: data });
  return (
    <Section
      title="Opening Minute"
      className="min-h-[80vh]"
      collapsible={false}
    >
      <PDFViewer className="w-full h-[70vh]">
        <OpeningMinuteTemplate data={data} />
      </PDFViewer>
    </Section>
  );
}
