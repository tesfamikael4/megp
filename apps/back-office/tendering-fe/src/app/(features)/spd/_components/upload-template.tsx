import { useEffect, useState } from 'react';
import {
  Button,
  FileButton,
  List,
  Table,
  LoadingOverlay,
  Modal,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import {
  useLazyGetFilesQuery,
  useUploadSpdMutation,
} from '../_api/template-spd.api';
import { FileViewer } from '../../_components/file-viewer';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
const UploadTemplate = () => {
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState<{ [key: string]: File | null }>({});
  const [currentView, setCurrentView] = useState<string>('main-document');
  const [uploadFile, { isLoading: isUploading }] = useUploadSpdMutation();
  async function onUpload(type: string) {
    logger.log(file);
    const formData = new FormData();
    formData.append('file', file?.[type] ?? '');
    try {
      await uploadFile({ id: id, type: type, file: formData });
      notify('Success', `${type} uploaded successfully`);
    } catch (err) {
      notify('Error', `Error in uploading ${type}`);
    }
  }
  function onFileChange(file: File | null, key: string) {
    const value = { [key]: file };
    setFile(value);
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
                </div>
                <div>
                  <List>
                    {file['main-document'] && <List.Item>template</List.Item>}
                  </List>
                  {file['main-document'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('main-document');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('main-document');
                      }}
                    >
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
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'bds');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['bds'] && <List.Item>{file['bds'].name}</List.Item>}
                  </List>
                  {file['bds'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('bds');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('bds');
                      }}
                    >
                      Preview
                    </Button>
                  }
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
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'scc');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['scc'] && <List.Item>{file['scc']?.name}</List.Item>}
                  </List>
                  {file['scc'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('scc');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('scc');
                      }}
                    >
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Invitation
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'invitation');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['invitation'] && (
                      <List.Item>{file['invitation']?.name}</List.Item>
                    )}
                  </List>
                  {file['invitation'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('scc');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('invitation');
                      }}
                    >
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Opening Minutes
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'opening-minutes');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['opening-minutes'] && (
                      <List.Item>{file['opening-minutes']?.name}</List.Item>
                    )}
                  </List>
                  {file['opening-minutes'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('opening-minute');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('opening-minute');
                      }}
                    >
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Evaluation Result
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'evaluation-result');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['evaluation-result'] && (
                      <List.Item>{file['evaluation-result']?.name}</List.Item>
                    )}
                  </List>
                  {file['evaluation-result'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('evaluation-result');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('evaluation-result');
                      }}
                    >
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Evaluation Report
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'evaluation-report');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['evaluation-report'] && (
                      <List.Item>{file['evaluation-report']?.name}</List.Item>
                    )}
                  </List>
                  {file['evaluation-report'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('evaluation-report');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('evaluation-report');
                      }}
                    >
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Award Notice
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'award-notice');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['award-notice'] && (
                      <List.Item>{file['award-notice']?.name}</List.Item>
                    )}
                  </List>
                  {file['award-notice'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('award-notice');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('award-notice');
                      }}
                    >
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Contract Notice
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'contract-notice');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['contract-notice'] && (
                      <List.Item>{file['contract-notice']?.name}</List.Item>
                    )}
                  </List>
                  {file['contract-notice'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('contract-notice');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('contract-notice');
                      }}
                    >
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td className="bg-slate-200 font-semibold w-2/6">
              Cancelation Notice
            </Table.Td>
            <Table.Td>
              <div className="flex space-x-4">
                <div className="my-auto">
                  <FileButton
                    onChange={(event) => {
                      onFileChange(event, 'cancelation-notice');
                    }}
                    accept=".docx"
                  >
                    {(props) => (
                      <Button variant="subtle" {...props}>
                        Select
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div>
                  <List>
                    {file['cancelation-notice'] && (
                      <List.Item>{file['cancelation-notice']?.name}</List.Item>
                    )}
                  </List>
                  {file['cancelation-notice'] && (
                    <Button
                      variant="filled"
                      onClick={() => {
                        onUpload('cancelation-notice');
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  {
                    <Button
                      variant="subtle"
                      onClick={() => {
                        open();
                        setCurrentView('cancelation-notice');
                      }}
                    >
                      Preview
                    </Button>
                  }
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Modal title="View Document" opened={opened} onClose={close} size="xl">
        <FilePreview id={id as any} type={currentView} />
      </Modal>
    </>
  );
};

const FilePreview = ({ id, type }: { id: string; type: string }) => {
  const [dowloadFile, { data: url, isLoading }] = useLazyGetFilesQuery();

  useEffect(() => {
    dowloadFile({ id: id, type: type });
  }, [id, type]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <FileViewer url={url?.presignedDownload ?? ''} filename={type} />
    </>
  );
};
export default UploadTemplate;
