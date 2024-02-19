'use client';
import { Text } from '@mantine/core';
import { usePathname } from 'next/navigation';

function PageTitle() {
  const path = usePathname();
  const routes = {
    basic: 'Basic Information',
    detail: 'Detailed Information',
    ppda: 'PPDA Registration',
    payment: 'Payment',
    doc: 'Document Attachment',
    review: 'Review & Submit',
  };

  const activeStepIndex = Object.keys(routes).indexOf(path.split('/')[4]);
  const activeStepValue = Object.values(routes)[activeStepIndex];

  return <Text fz="md">{activeStepValue}</Text>;
}

export default PageTitle;
