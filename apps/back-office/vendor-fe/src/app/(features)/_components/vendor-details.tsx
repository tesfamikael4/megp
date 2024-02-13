import FormPreview from './details-accordion';

export default function VendorDetail({ data }: { data: any }) {
  return <FormPreview data={{ ...data, ...data.metaData }} />;
}
