import React, { useState } from 'react';
import { Accordion, Modal } from '@mantine/core';
import classes from './accordion.module.scss';
import { ShowFile } from '@/app/(features)/_components/details-accordion';
import { renderTable } from '@/app/(features)/util/renderTable';
import { useDisclosure } from '@mantine/hooks';
import {
  accordionTabs,
  formatColumns,
} from '@/app/(features)/_constants/reviewTabs';
import {
  DocumentPanel,
  PaymentReceiptPanel,
} from './components/payment-receipt';
import MiscellaneousPanel from './components/miscelenous-panel';
import { FormattedPanel } from './components/formatted-panel';

function FormPreview({
  data,
  uniqueTabs = [],
  userId,
}: {
  data: any;
  userId?: string;
  uniqueTabs?: { tabValue: string; tabName: string }[];
}) {
  const tabs = [
    ...uniqueTabs,
    ...accordionTabs(data?.basic?.countryOfRegistration),
  ];

  const [url, setUrl] = useState('');
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Accordion variant="separated" classNames={classes}>
      {tabs.map((tab) => {
        const { tabValue, tabName } = tab;
        if (data[tabValue]) {
          return (
            <>
              <Modal
                opened={opened}
                onClose={close}
                size={'60%'}
                centered
                title={'Attachment'}
                bg={'transparent'}
              >
                {url && <ShowFile url={url} filename={data[tabValue]} />}
              </Modal>
              <Accordion.Item
                key={tabValue}
                className={classes.item}
                value={tabValue}
              >
                <Accordion.Control>{tabName}</Accordion.Control>
                {Array.isArray(data[tabValue]) ? (
                  <Accordion.Panel
                    key={tabValue}
                    className="items-center"
                    styles={{
                      panel: {
                        padding: 0,
                      },
                      content: {
                        padding: 0,
                      },
                    }}
                  >
                    {renderTable(
                      data[tabValue],
                      formatColumns(data?.basic?.countryOfRegistration),
                      tabValue,
                      open,
                      setUrl,
                      userId,
                    )}
                  </Accordion.Panel>
                ) : formatColumns(data?.basic?.countryOfRegistration)[
                    tabValue
                  ] ? (
                  <FormattedPanel data={data} tabValue={tabValue} />
                ) : (
                  <RenderObject
                    data={data}
                    tabValue={tabValue}
                    setUrl={setUrl}
                    open={open}
                  />
                )}
              </Accordion.Item>
            </>
          );
        }
        return null;
      })}
    </Accordion>
  );
}

export default FormPreview;

const RenderObject = ({
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
  const _panelObject = data[tabValue];
  return (
    <>
      {Object.keys(_panelObject).map((fieldKey) => {
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
            data={_panelObject?.[fieldKey]}
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
