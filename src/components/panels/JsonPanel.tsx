import {
  CardRoot,
  CardHeader,
  CardBody,
  HStack, Button,
} from '@chakra-ui/react';

import {Content} from '../content/content';
import {FileChangeDetails} from '@zag-js/file-upload';
import {JsonFolderChooser} from "@/components/uploaders/JsonSpecChooser.tsx";
import {JSX, useState} from "react";
import {FileUploadRoot, FileUploadTrigger} from "@/components/ui/file-upload.tsx";
import {MdFileUpload} from "react-icons/md";
import {JsonGen} from 'apollo-oas';
import {EditorWrapper} from "@/components/editor/EditorWrapper.tsx";

interface IJsonPanelProps {
  onChange: (schema: string) => void;
}

export const JsonPanel = ({onChange}: IJsonPanelProps): JSX.Element => {
  const [json, setJson] = useState<string>('');

  return (
    <CardRoot
      className="json-panel-container" m={0} style={{flex: 1}} size='sm'>
      <CardHeader>
        <HStack gap={2} alignItems={'left'} justifyContent='end'>
          <FileUploadRoot
            onFileChange={(e: FileChangeDetails): void => {
              const file = e.acceptedFiles[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = async (reader) => {
                  if (!reader.target?.result) {
                    return;
                  }

                  const content = reader.target.result as string;
                  const walker = JsonGen.fromReader(content);
                  const generateSchema = walker.generateSchema();
                  onChange(generateSchema);
                  setJson(content);
                };

                reader.readAsText(file);
              }
            }}
            accept={['application/json']}
          >
            <FileUploadTrigger asChild>
              <Button variant='outline' size='sm'>
                <MdFileUpload/> JSON file
              </Button>
            </FileUploadTrigger>
          </FileUploadRoot>

          <JsonFolderChooser
            onFileChange={(e: FileChangeDetails): void => {
              throw new Error('Function not implemented.');
            }}
          />
        </HStack>
      </CardHeader>
      <CardBody m={0} p={0}>
        {json &&
            <EditorWrapper title="Input JSON" value={json} language={'json'}/>
        }
      </CardBody>
    </CardRoot>
  );
};
