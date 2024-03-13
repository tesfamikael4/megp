import { DocumentPanel } from './documentPanel';
import { MiscellaneousPanel } from './miscellaneousPanel';
import { PaymentReceiptPanel } from './paymentReceiptPanel';

export const RenderObject = ({
  data,
  tabValue,
  setUrl,
  open,
}: {
  data: any;
  tabValue: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  open: () => void;
}): React.ReactNode => {
  return (
    <>
      {Object.keys(data[tabValue]).map((fieldKey) => {
        return tabValue === 'supportingDocuments' ||
          tabValue === 'certificate' ? (
          <DocumentPanel data={data} tabValue={tabValue} fieldKey={fieldKey} />
        ) : tabValue === 'paymentReceipt' && fieldKey === 'attachment' ? (
          <PaymentReceiptPanel
            data={data}
            tabValue={tabValue}
            fieldKey={fieldKey}
          />
        ) : (
          <MiscellaneousPanel
            data={data[tabValue]?.[fieldKey]}
            fieldKey={fieldKey}
            tabValue={tabValue}
            setUrl={setUrl}
            open={open}
            userId={data?.userId}
          />
        );
      })}
    </>
  );
};
