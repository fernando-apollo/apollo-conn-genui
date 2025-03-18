import {
  Box,
  CardBody,
  CardHeader,
  CardRoot,
  HStack,
  IconButton,
} from '@chakra-ui/react';

import {
  JsonFileChooser,
  JsonFolderChooser,
} from '@/components/uploaders/JsonSpecChooser.tsx';
import { JSX, useEffect, useState } from 'react';
import { JsonGen } from 'apollo-conn-gen';
import { EditorWrapper } from '@/components/editor/EditorWrapper.tsx';
import { IoMdColorWand } from 'react-icons/io';
import { Tooltip } from '@/components/ui/tooltip.tsx';
import { Tag } from '@/components/ui/tag.tsx';
import { useUploadState } from '@/hooks/useUploadState';

interface IJsonPanelProps {
  onChange: (schema: string) => void;
}

export const JsonPanel = ({ onChange }: IJsonPanelProps): JSX.Element => {
  const {
    fileName,
    setFileName,
    uploadedFiles,
    setUploadedFiles,
    onFileChange,
    onFolderChange,
  } = useUploadState();
  const [content, setContent] = useState<string>('{}');

  useEffect(() => {
    console.log('>>>> uploadedFiles', uploadedFiles);

    if (uploadedFiles.length > 0) {
      const walker = JsonGen.new();

      uploadedFiles.forEach((file) => walker.walkJson(file.content));
      const generateSchema = walker.generateSchema();

      onChange(generateSchema);
      setFileName(uploadedFiles[0].name);
      setContent(uploadedFiles[0].content);
    }
  }, [uploadedFiles, onChange, setFileName]);

  const onGenerateSchema = () => {
    const walker = JsonGen.new();
    walker.walkJson(content);
    const generateSchema = walker.generateSchema();

    onChange(generateSchema);
  };

  const FileList = () => (
    <HStack overflowX='auto' overflowY='hidden'>
      {uploadedFiles.map((processed, index) => {
        return (
          <Tooltip content={processed.name} key={index}>
            <Tag
              variant={fileName === processed.name ? 'solid' : 'outline'}
              closable={uploadedFiles.length > 1}
              size='lg'
              key={index}
              onClose={async () => {
                setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
              }}
              onClick={() => {
                setFileName(processed.name);
                setContent(processed.content);
              }}
            >
              {processed.name}
            </Tag>
          </Tooltip>
        );
      })}
    </HStack>
  );

  return (
    <CardRoot
      className='json-panel-container'
      m={0}
      p={0}
      style={{ flex: 1 }}
      size='sm'
      border='0'
    >
      <CardHeader>
        <HStack display='flex'>
          <JsonFileChooser onFileChange={onFileChange} />
          <JsonFolderChooser onFileChange={onFolderChange} />
          <Box flex='1' display='flex' flexDirection='column'>
            <Tooltip content='Generate schema for files'>
              <IconButton
                colorPalette='brand'
                variant='solid'
                aria-label='Generate schema for files'
                size='xs'
                alignSelf='flex-end'
                disabled={content === ''}
                onClick={onGenerateSchema}
              >
                <IoMdColorWand />
              </IconButton>
            </Tooltip>
          </Box>
        </HStack>
      </CardHeader>

      <CardBody m={0} pt={2}>
        {fileName && uploadedFiles.length > 0 && <FileList />}
        <EditorWrapper
          title='Input JSON'
          value={content}
          language={'json'}
          readOnly={false}
          onEditorChange={(value) => {
            if (value) {
              console.log('value', value);
              setContent(value);
            }
          }}
        />
      </CardBody>
    </CardRoot>
  );
};
