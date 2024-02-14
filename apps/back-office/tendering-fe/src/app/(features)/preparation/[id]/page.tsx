'use client';
import {
  Box,
  Container,
  Divider,
  Flex,
  Tabs,
  Tooltip,
  Accordion,
  Combobox,
  InputBase,
  Input,
  useCombobox,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';
import FormDetail from '../_components/form-detail';
import { useState } from 'react';

export default function TenderDetailPage() {
  const router = useRouter();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string | null>(null);
  return (
    <>
      <Box className="bg-white rounded shadow-sm">
        <div className="text-lg font-medium mt-4 pt-4 pb-4">
          <Tooltip
            label="List Standard Procurement Document"
            className="cursor-pointer"
            onClick={() => router.push(`/spd`)}
            position="top-start"
          >
            <Flex align="center">
              <IconChevronLeft />
              Standard procurement document details
            </Flex>
          </Tooltip>
        </div>
        <Box className="">
          <Divider mb={'md'} />
          <Container fluid>
            <Tabs defaultValue="definition" keepMounted={false}>
              <Tabs.List className=" flex-nowrap">
                <Tabs.Tab value="definition">Schedule of requirement</Tabs.Tab>
                <Tabs.Tab value="documents">Bidding procedure</Tabs.Tab>
                <Tabs.Tab value="documents">Evaluation criteria</Tabs.Tab>
                <Tabs.Tab value="documents">Contract conditions</Tabs.Tab>
              </Tabs.List>
              <div className="flex justify-end my-2">
                <Combobox
                  store={combobox}
                  onOptionSubmit={(val) => {
                    setValue(val);
                    combobox.closeDropdown();
                  }}
                >
                  <Combobox.Target>
                    <InputBase
                      component="button"
                      type="button"
                      pointer
                      rightSection={<Combobox.Chevron />}
                      rightSectionPointerEvents="none"
                      onClick={() => combobox.toggleDropdown()}
                    >
                      {value || (
                        <Input.Placeholder>Pick value</Input.Placeholder>
                      )}
                    </InputBase>
                  </Combobox.Target>

                  <Combobox.Dropdown>
                    <Combobox.Options>Lot 1</Combobox.Options>
                  </Combobox.Dropdown>
                </Combobox>
              </div>
              <Divider mb={'md'} />
              <Tabs.Panel value="definition" className="py-4">
                <FormDetail />
              </Tabs.Panel>

              <Tabs.Panel value="documents" className="py-4">
                <></>
              </Tabs.Panel>

              <Tabs.Panel value="evaluationCriteria" className="py-4">
                <Accordion variant="filled" defaultValue="Apples">
                  <Accordion.Item
                    key="preliminary"
                    value="Preliminary Evaluation"
                  >
                    <Accordion.Control>
                      Preliminary Evaluation
                    </Accordion.Control>
                    <Accordion.Panel>{<></>}</Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item key="qualification" value="Qualification">
                    <Accordion.Control>Qualification</Accordion.Control>
                    <Accordion.Panel>{<></>}</Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item
                    key="documentary"
                    value="Documentary Evidence"
                  >
                    <Accordion.Control>Documentary Evidence</Accordion.Control>
                    <Accordion.Panel>{<></>}</Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item key="preference" value="Preference Margin">
                    <Accordion.Control>Preference Margin</Accordion.Control>
                    <Accordion.Panel>{<></>}</Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item
                    key="technicalEvaluation"
                    value="Technical Evaluation"
                  >
                    <Accordion.Control>Technical Evaluation</Accordion.Control>
                    <Accordion.Panel>{<></>}</Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Tabs.Panel>
            </Tabs>
          </Container>
        </Box>
      </Box>
    </>
  );
}
