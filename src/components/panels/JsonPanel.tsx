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
import { JsonEditor } from '@/components/editor/EditorWrapper.tsx';
import { IoMdColorWand } from 'react-icons/io';
import { Tooltip } from '@/components/ui/tooltip.tsx';
import { Tag } from '@/components/ui/tag.tsx';
import { UploadedFile, useUploadState } from '@/hooks/useUploadState';
import _ from 'lodash';
import { useDebounce } from '@/hooks/useDebounce.ts';
import { MdHourglassBottom } from 'react-icons/md';

interface IJsonPanelProps {
  onChange: (schema: string) => void;
}

export const JsonPanel = ({ onChange }: IJsonPanelProps): JSX.Element => {
  const { fileName, setFileName, uploadedFiles, onFileChange, onFolderChange } =
    useUploadState();

  const [content, setContent] = useState<string>('{}');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [working, setWorking] = useState<boolean>(false);
  const [invalidJson, setInvalidJson] = useState<boolean>(false);

  const updateFileContent = (newContent: string) => {
    if (!fileName) return;
    setFiles(
      files.map((file) =>
        file.name === fileName ? { ...file, content: newContent } : file
      )
    );
  };

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setFiles(_.cloneDeep(uploadedFiles));

      const walker = JsonGen.new();
      uploadedFiles.forEach((file) => walker.walkJson(file.content));
      const generateSchema = walker.generateSchema();

      onChange(generateSchema);
      setFileName(uploadedFiles[0].name);
      setContent(uploadedFiles[0].content);
    }
  }, [uploadedFiles, onChange, setFileName]);

  // this works with the cloned files, not the original uploaded files
  const onGenerateSchema = () => {
    const walker = JsonGen.new();
    if (files.length > 0) {
      files.forEach((file) => walker.walkJson(file.content));
    } else {
      walker.walkJson(content);
    }

    const schema = walker.generateSchema();
    onChange(schema);
  };

  const debouncedUpdate = useDebounce({
    callback: () => {
      onGenerateSchema();
      setWorking(false);
    },
  });

  const FileList = () => (
    <HStack overflowX='auto' overflowY='hidden'>
      {files.map((processed, index) => {
        return (
          <Tooltip content={processed.name} key={index}>
            <Tag
              cursor='pointer'
              colorPalette='brand'
              variant={fileName === processed.name ? 'solid' : 'outline'}
              closable={files.length > 1}
              size='lg'
              key={index}
              onClose={async () =>
                setFiles(files.filter((_, i) => i !== index))
              }
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
      <CardHeader m={0} p={2}>
        <HStack display='flex'>
          <JsonFileChooser onFileChange={onFileChange} />
          <JsonFolderChooser onFileChange={onFolderChange} />
          <HStack flex='1' justifyContent='flex-end'>
            {working && <MdHourglassBottom />}
            <Tooltip content='Generate schema for contents'>
              <IconButton
                colorPalette='brand'
                variant='solid'
                aria-label='Generate schema for contents'
                size='xs'
                alignSelf='flex-end'
                disabled={working || invalidJson}
                onClick={onGenerateSchema}
              >
                <IoMdColorWand />
              </IconButton>
            </Tooltip>
          </HStack>
        </HStack>
      </CardHeader>

      <CardBody m={0} p='0' pt={2}>
        {fileName && files.length > 0 && (
          <Box pl='2' pr='2'>
            <FileList />
          </Box>
        )}
        <JsonEditor
          title='Input JSON'
          info="You can edit the contents below and click on the 'Generate schema for contents' button to re-generate the schema."
          value={content}
          language={'json'}
          readOnly={false}
          onEditorChange={(value) => {
            if (value) {
              // Try parsing the content to ensure it is valid JSON
              try {
                JSON.parse(value);
                // if we reached here, we have a valid JSON content
                setInvalidJson(false);
                setWorking(true);
                setContent(value);
                updateFileContent(value);
                debouncedUpdate();
              } catch (e) {
                // ignore
                setInvalidJson(true);
              }
            }
          }}
        />
      </CardBody>
    </CardRoot>
  );
};
