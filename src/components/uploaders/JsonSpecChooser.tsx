import {
  // FileUploadList,
  // FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from '../ui/file-upload.tsx';
import { Button, FileUploadHiddenInput } from '@chakra-ui/react';
import { FileChangeDetails, FileRejectDetails } from '@zag-js/file-upload';
import { MdDriveFolderUpload, MdFileUpload } from 'react-icons/md';

interface ISpecChooserParams {
  onFileChange: (e: FileChangeDetails) => void;
  fileName?: string;
}

export const JsonFileChooser = ({
  onFileChange,
  fileName,
}: ISpecChooserParams) => (
  <FileUploadRoot
    onFileChange={onFileChange}
    accept={['application/json']}
    flex='0'
  >
    <FileUploadTrigger asChild>
      <Button
        size='sm'
        colorPalette='brand'
        variant='solid'
        bg='button.primary.bg'
        color='button.primary.fg'
      >
        <MdFileUpload /> {fileName ? fileName : 'JSON file'}
      </Button>
    </FileUploadTrigger>
  </FileUploadRoot>
);

export const JsonFolderChooser = (props: ISpecChooserParams) => {
  return (
    <FileUploadRoot
      directory
      onFileReject={(e: FileRejectDetails) => {
        // this is a terrible work-around on the file-upload component, it caches the files and doesn't clear them
        // so we need to disable the maxFiles and use this instead.
        props.onFileChange({
          acceptedFiles: e.files.map((file) => file.file),
          rejectedFiles: [],
        });
      }}
      accept={['application/json']}
      maxFileSize={1024 * 1024 * 10}
      flex='0'
    >
      <FileUploadHiddenInput />
      <FileUploadTrigger asChild>
        <Button
          size='sm'
          colorPalette='brand'
          variant='solid'
          bg='button.primary.bg'
          color='button.primary.fg'
        >
          <MdDriveFolderUpload /> JSON folder
        </Button>
      </FileUploadTrigger>
    </FileUploadRoot>
  );
};
