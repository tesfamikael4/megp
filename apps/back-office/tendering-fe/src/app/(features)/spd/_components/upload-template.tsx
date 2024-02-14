import { useState } from 'react';
import {
  Button,
  FileButton,
  List,
  Table,
  LoadingOverlay,
  Modal,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useUploadSpdMutation } from '../_api/template-spd.api';
import { FileViewer } from '../../_components/file-viewer';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
const UploadTemplate = () => {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [bdsFile, setBdsFiles] = useState<File | null>(null);
  const [sccFile, setSccFiles] = useState<File | null>(null);
  const [uploadFile, { isLoading: isUploading }] = useUploadSpdMutation();
  async function onUpload() {
    logger.log(file);
    const formData = new FormData();
    formData.append('file', file ?? '');
    uploadFile({ id: id, file: formData });
  }
  return (
    <>
      <LoadingOverlay visible={isUploading} />
      <Table highlightOnHover withTableBorder withColumnBorders>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Standard procurement document
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton onChange={setFile} accept=".docx">
                    {(props) => (
                      <Button {...props} variant="subtle">
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>{file && <List.Item>template</List.Item>}</List>
                  {file && (
                    <Button variant="filled" onClick={onUpload}>
                      Upload
                    </Button>
                  )}
                  {
                    <Button variant="subtle" onClick={open}>
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Bid data sheet
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton onChange={setBdsFiles} accept=".docx">
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {bdsFile && <List.Item>{bdsFile.name}</List.Item>}
                  </List>
                  {bdsFile && (
                    <Button variant="filled" onClick={onUpload}>
                      Upload
                    </Button>
                  )}
                  {bdsFile && (
                    <Button variant="subtle" onClick={open}>
                      Preview
                    </Button>
                  )}
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Special condition of contract
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton onChange={setSccFiles} accept=".docx">
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {sccFile && <List.Item>{sccFile.name}</List.Item>}
                  </List>
                  {sccFile && (
                    <Button variant="filled" onClick={onUpload}>
                      Upload
                    </Button>
                  )}
                  {sccFile && (
                    <Button variant="subtle" onClick={open}>
                      Preview
                    </Button>
                  )}
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Modal title="View Document" opened={opened} onClose={close}>
        <FilePreview id={id as any} />
      </Modal>
    </>
  );
};

const FilePreview = ({ id }: { id: string }) => {
  return (
    <>
      <FileViewer
        url={
          `${
            process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'
          }/spd/download-spd/${id}` ?? ''
        }
        filename="Standard procurement document template"
      />
    </>
  );
};
export default UploadTemplate;
