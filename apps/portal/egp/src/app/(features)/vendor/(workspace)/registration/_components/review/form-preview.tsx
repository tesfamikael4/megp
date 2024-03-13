'use client';

import React, { useState } from 'react';
import { Accordion, Modal } from '@mantine/core';
import classes from './accordion.module.scss';
import { renderTable } from './renderTable';
import { useDisclosure } from '@mantine/hooks';
import { formatColumns, tab } from '../../_constants';
import { ShowFile } from './panels/showFile';
import { FormattedPanel } from './panels/formatedPanel';
import { RenderObject } from './panels/renderObject';

function FormPreview({
  data,
  uniqueTabs = [],
}: {
  data: any;
  uniqueTabs?: { tabValue: string; tabName: string }[];
}) {
  const tabs = [...uniqueTabs, ...tab];

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
                    {renderTable(data[tabValue], formatColumns, tabValue)}
                  </Accordion.Panel>
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
