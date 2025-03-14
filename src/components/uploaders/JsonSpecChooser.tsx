import {
  FileUploadList,
  // FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from '../ui/file-upload.tsx';
import {Button, FileUploadHiddenInput} from '@chakra-ui/react';
import { FileChangeDetails } from '@zag-js/file-upload';
import {MdDriveFolderUpload, MdFileUpload} from "react-icons/md";

interface ISpecChooserParams {
  onFileChange: (e: FileChangeDetails) => void;
}

export const JsonFileChooser = (props: ISpecChooserParams) => (
  <FileUploadRoot
    onFileChange={props.onFileChange}
    accept={['application/json']}
  >
    <FileUploadTrigger asChild>
      <Button variant='outline' size='sm'>
        <MdFileUpload /> JSON file
      </Button>
    </FileUploadTrigger>
  </FileUploadRoot>
);

export const JsonFolderChooser = (props: ISpecChooserParams) => (
  <FileUploadRoot directory onFileChange={props.onFileChange}>
    <FileUploadHiddenInput />
    <FileUploadTrigger asChild>
      <Button variant="outline" size="sm">
        <MdDriveFolderUpload /> JSON folder
      </Button>
    </FileUploadTrigger>
    <FileUploadList />
  </FileUploadRoot>
);
