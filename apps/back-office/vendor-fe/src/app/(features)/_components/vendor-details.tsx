import { Section } from '@megp/core-fe';
import React from 'react';
import FormPreview from './details-accordion';

export default function VendorDetail({ data }: { data: any }) {
  return <FormPreview data={{ ...data, ...data.metaData }} />;
}
