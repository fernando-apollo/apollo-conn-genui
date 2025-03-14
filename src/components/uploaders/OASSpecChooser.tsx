import { FileChangeDetails } from '@zag-js/file-upload';
import { MdOutlineUploadFile } from 'react-icons/md';
import { FileUploadRoot, FileUploadTrigger } from '../ui/file-upload';
import { Button } from '@chakra-ui/react';

interface ISpecChooserParams {
  onFileChange: (e: FileChangeDetails) => void;
}

export const OASSpecChooser = (props: ISpecChooserParams) => (
  <FileUploadRoot
    onFileChange={props.onFileChange}
    accept={['application/json', 'application/x-yaml']}
  >
    <FileUploadTrigger asChild>
      <Button size='sm'>
        <MdOutlineUploadFile /> OAS specification
      </Button>
    </FileUploadTrigger>
  </FileUploadRoot>
);
