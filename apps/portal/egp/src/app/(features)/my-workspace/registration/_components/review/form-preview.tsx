'use client';

import React, { useState } from 'react';
import { Accordion, Box, List, Modal } from '@mantine/core';
import classes from './accordion.module.scss';
import { renderTable } from './renderTable';
import { useDisclosure } from '@mantine/hooks';
import { formatColumns as _formatColumns, tab } from '../../_constants';
import { ShowFile } from './panels/showFile';
import { FormattedPanel } from './panels/formatedPanel';
import { RenderObject } from './panels/renderObject';
import { useAuth } from '@megp/auth';

function FormPreview({
  data,
  uniqueTabs = [],
}: {
  data: any;
  uniqueTabs?: { tabValue: string; tabName: string }[];
}) {
  const [url, setUrl] = useState({ url: '', filename: '' });
  const [opened, { close, open }] = useDisclosure(false);
  const { user } = useAuth();

  const tabs = [...uniqueTabs, ...tab(data.basic.countryOfRegistration)];
  const formatColumns = _formatColumns(data.basic.countryOfRegistration);

  const fileUrl = (tabValue) => {
    return `${
      process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api'
    }/upload/get-file/${
      tabValue === 'supportingDocuments'
        ? 'SupportingDocument'
        : tabValue === 'certificate'
          ? 'certificate'
          : 'paymentReceipt'
    }/${data[tabValue]}`;
  };

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
                {url.url && <ShowFile url={url.url} filename={url.filename} />}
              </Modal>
              <Accordion.Item
                key={tabValue}
                className={classes.item}
                value={tabValue}
              >
                <Accordion.Control>{tabName}</Accordion.Control>
                {typeof data[tabValue] === 'string' ? (
                  <Accordion.Panel key={tabValue}>
                    <Accordion.Panel>
                      {data[tabValue] ? (
                        <ShowFile
                          url={fileUrl(tabValue)}
                          filename={data[tabValue]}
                          zoom
                        />
                      ) : (
                        <Box className="flex items-center h-20 w-full justify-center">
                          No file uploaded
                        </Box>
                      )}
                    </Accordion.Panel>
                  </Accordion.Panel>
                ) : Array.isArray(data[tabValue]) ? (
                  tabValue === 'lineOfBusinessView' ? (
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
                      <List withPadding type="ordered">
                        {data[tabValue].map((value, index) => (
                          <List.Item key={index}>{value}</List.Item>
                        ))}
                      </List>
                    </Accordion.Panel>
                  ) : (
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
                        formatColumns,
                        tabValue,
                        open,
                        setUrl,
                        user?.id,
                      )}
                    </Accordion.Panel>
                  )
                ) : formatColumns[tabValue] ? (
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
