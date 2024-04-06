import { Box, Button, FileButton, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';
import React, { useState } from 'react';

const DocumentaryEvidence = () => {
  const [file, setFile] = useState<{ [key: string]: File | null }>({});
  function onFileChange(file: File | null, key: string) {
    const value = { [key]: file };
    setFile(value);
  }
  return (
    <>
      <Section title="Documentary Evidence" defaultCollapsed={true}>
        <Box className="w-full">
          <Flex
            direction="column"
            className="border-t border-l border-r border-gray-400"
          >
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                Power of attorney
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                Articles of Incorporation
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                Letter of Intent to form JV
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>State-owned Enterprise Eligbility</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Organizational Structure</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Benefical Ownership Disclosure*</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Business Registration Certificate</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Business License Certificate</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Tax Clearance Certificate</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Audited Balance Sheet</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Audited Income Statement</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Code of conduct Agreement</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Sub-Contractors Agreements</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Technical Capabilities</Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                <Box className="flex justify-between">
                  <Box>Manufacturing Authization </Box>
                </Box>
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                <FileButton
                  onChange={(event) => {
                    onFileChange(event, 'main-document');
                  }}
                  accept=".docx"
                >
                  {(props) => (
                    <Button {...props} variant="subtle">
                      Select
                    </Button>
                  )}
                </FileButton>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Section>
    </>
  );
};

export default DocumentaryEvidence;
