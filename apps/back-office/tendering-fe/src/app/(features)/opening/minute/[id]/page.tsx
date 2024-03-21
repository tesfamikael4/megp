'use client';
import { Section } from '@megp/core-fe';
import { OpeningMinuteTemplate } from './_components/pdf-template';
import { PDFViewer } from '@react-pdf/renderer';

export default function OpeningMinute() {
  return (
    <Section
      title="Opening Minute"
      className="min-h-[80vh]"
      collapsible={false}
    >
      <PDFViewer className="w-full h-[70vh]">
        <OpeningMinuteTemplate />
      </PDFViewer>
    </Section>
  );
}
