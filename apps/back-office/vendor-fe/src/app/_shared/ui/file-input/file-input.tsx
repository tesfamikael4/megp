import { Button, Tooltip } from '@mantine/core';
import { IconCircleMinus, IconCirclePlus, IconUpload } from '@tabler/icons';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FilePreview } from './components/file-preview';

/* Component props */
type FileInputProps = {
  formMode?: string;
  name?: string;
  label?: string;
  selectedResourceType?: string;
  selectedResource?: any;
  className?: string;
  required?: boolean;
  multiple?: boolean;
  error?: string;
  fileFormats?: string[];
  getValue?: (files: any) => void;
  onChange?: (files: any) => void;
  uploadFirst?: boolean;
  onUploadClick?: (files: any) => void;
  withPreview?: boolean;
  maxFileSize?: number;
  reactHookFormRegister?: any;
  reactHookFormSetValue?: any;
  maxNoFileInput?: number;
};

/* Component defintion */
const FileInput = (props: FileInputProps) => {
  /* Component states */
  const [checkLength, SetCheckLength] = useState<number>(0);
  const [noFileInput, setNoFileInput] = useState<number>(1);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [chosenFiles, setChosenFiles] = useState<any>([]);
  const [error, setError] = useState<string | undefined>(props?.error);
  const styles = {
    color: props?.formMode === 'new' ? 'transparent' : '',
  };
  /* Hook */
  const inputRef = useRef([]);
  /* Event handlers */
  const onFileChange = (event, index) => {
    SetCheckLength(event?.target?.files[0]?.length);
    let selectedFiles = [...chosenFiles];
    if (event.target.files?.length >= 1) {
      if (validateFile(event.target.files[0])) {
        selectedFiles = chosenFiles?.map((item: any, i) => {
          if (i === index) {
            return event.target.files[0];
          }
          return item;
        });
        setChosenFiles([...selectedFiles]);
      } else {
        if (props?.reactHookFormRegister && props?.reactHookFormSetValue) {
          props?.reactHookFormSetValue(
            props?.multiple ? `${props.name}.${index}` : props.name,
            undefined,
          );
        } else {
          inputRef.current[index].value = null;
        }
        selectedFiles = chosenFiles?.map((item: any, i) => {
          if (i === index) {
            return null;
          }
          return item;
        });
        setChosenFiles([...selectedFiles]);
      }
    } else {
      selectedFiles = chosenFiles?.map((item: any, i) => {
        if (i === index) {
          return null;
        }
        return item;
      });
      setChosenFiles([...selectedFiles]);
    }
    if (props?.onChange) {
      props?.onChange(selectedFiles);
    }
  };

  const onAddFileInput = () => {
    if (props?.maxNoFileInput && noFileInput < props?.maxNoFileInput) {
      setNoFileInput(noFileInput + 1);
    } else if (props?.maxNoFileInput === undefined) {
      setNoFileInput(noFileInput + 1);
    }
  };

  const onDiscard = (index: number) => {
    if (props?.reactHookFormRegister && props?.reactHookFormSetValue) {
      props?.reactHookFormSetValue(
        props?.multiple ? `${props.name}.${index}` : props.name,
        undefined,
      );
    } else {
      inputRef.current[index].value = null;
    }

    setChosenFiles(
      chosenFiles?.map((item: any, i) => {
        if (i === index) {
          return null;
        }
        return item;
      }),
    );
  };

  const onRemove = () => {
    setNoFileInput(noFileInput - 1);
    setChosenFiles(
      chosenFiles?.filter(
        (item: any, index: number) => index !== chosenFiles.length - 1,
      ),
    );
  };

  const onUploadClick = () => {
    if (chosenFiles.length.length > 0) {
      setIsUploadingFile(true);
      props?.onUploadClick(chosenFiles);
      setIsUploadingFile(false);
    }
  };

  const validateFile = (file: any): boolean => {
    if (
      props?.fileFormats &&
      !props?.fileFormats?.includes(
        file?.name.substring(file?.name.indexOf('.') + 1),
      )
    ) {
      setError(`Please enter a valid file type`);
      return false;
    } else if (props?.maxFileSize && file.size > props.maxFileSize) {
      setError(`File should be less than ${props.maxFileSize / 1000000}MB`);
      return false;
    } else {
      setError(undefined);
    }
    return true;
  };

  /* useEffect hoooks */
  useEffect(() => {
    if (props?.error) {
      setError(props?.error);
    }
  }, [props?.error]);

  useEffect(() => {
    if (noFileInput > chosenFiles.length) {
      setChosenFiles([...chosenFiles, null]);
    }
  }, [noFileInput]);

  useEffect(() => {
    if (chosenFiles.length > 0 && props?.getValue) {
      props?.getValue(chosenFiles);
    }
  }, [chosenFiles]);

  return (
    <div className={props.className}>
      <div className="mb-2 flex items-center">
        <label className="font-medium">{props.label}</label>
        {props.required && <span className="text-red-500">*</span>}
        {props?.multiple && (
          <Tooltip
            label="Add file input"
            withArrow
            className={'ml-2'}
            position={'top'}
          >
            <div>
              <IconCirclePlus
                className={`${
                  noFileInput === props?.maxNoFileInput
                    ? 'text-gray-200 hover:cursor-not-allowed'
                    : 'hover:cursor-pointer'
                }`}
                onClick={onAddFileInput}
              />
            </div>
          </Tooltip>
        )}
        {props?.multiple && noFileInput > 1 && (
          <Tooltip
            label="Remove file input"
            withArrow
            className={'ml-2'}
            position={'top'}
          >
            <div>
              <IconCircleMinus
                className={'hover:cursor-pointer'}
                onClick={onRemove}
              />
            </div>
          </Tooltip>
        )}
      </div>
      <div className="border border-gray-300">
        {chosenFiles.map((_, index) => (
          <div key={index} className={'flex items-center py-2 px-2'}>
            <input
              style={styles}
              name={`${props?.name}${props?.multiple && `.${index}`}`}
              required={props?.required}
              className=" block w-auto"
              type="file"
              ref={(element) => (inputRef.current[index] = element)}
              onChange={(event) => onFileChange(event, index)}
              {...(props?.reactHookFormRegister
                ? props?.reactHookFormRegister(
                    props?.multiple ? `${props.name}.${index}` : props.name,
                    {
                      onChange: (event) => onFileChange(event, index),
                      shouldUnregister: true,
                    },
                  )
                : {})}
            />

            <div className="ml-10 flex">
              {props.uploadFirst && (
                <Button
                  disabled={chosenFiles.length === 0}
                  size="xs"
                  loading={isUploadingFile}
                  onClick={() => onUploadClick()}
                  type="button"
                  className="ml-1 bg-primary"
                >
                  <IconUpload />
                  Upload
                </Button>
              )}
              {props?.withPreview && chosenFiles[index] && (
                <FilePreview
                  modalTitle={props?.label}
                  fileUrl={URL.createObjectURL(chosenFiles[index])}
                  fileName={chosenFiles[index]?.name}
                />
              )}
              {chosenFiles[index] && (
                <span
                  className="ml-2 text-red-500 hover:cursor-pointer hover:underline"
                  onClick={() => onDiscard(index)}
                >
                  Discard
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="m-2 mx-2 font-bold ">
        {props?.formMode === 'update' &&
          checkLength === 0 &&
          `${
            props?.selectedResource?.attachment?.originalname
              ? props?.selectedResource?.attachment?.originalname
              : `${props?.selectedResource}.${props?.selectedResourceType}`
          }`}
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export { FileInput };
