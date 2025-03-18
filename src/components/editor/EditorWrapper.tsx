import {
  CardRoot,
  CardHeader,
  Heading,
  CardBody,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { Editor, Monaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import monaco from 'monaco-editor';
import { useRef } from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Tooltip } from '../ui/tooltip';

type IEditorProps = {
  value: string;
  language: string;
  title: string;
  info?: string;
  readOnly?: boolean;
  onEditorChange?: (value: string | undefined) => void;
};

export const EditorWrapper = ({
  value,
  language = 'graphql',
  title,
  info = '',
  readOnly = true,
  onEditorChange,
}: IEditorProps) => {
  const theme = useTheme();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    _: Monaco
  ) {
    editorRef.current = editor;
  }

  return (
    <CardRoot size='sm' variant='outline' style={{ flex: 1 }} border='0'>
      <CardHeader p={2} m={0}>
        <HStack>
          <Heading size={'sm'}>{title}</Heading>
          {info && (
            <Tooltip content={info} aria-label={info}>
              <Icon size='md' color='gray.900'>
                <IoMdInformationCircleOutline />
              </Icon>
            </Tooltip>
          )}
        </HStack>
      </CardHeader>
      <CardBody m={0} p={0}>
        <Editor
          onMount={handleEditorDidMount}
          theme={theme.resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          defaultLanguage={language}
          value={value}
          onChange={onEditorChange ? onEditorChange : () => {}}
          options={{
            readOnly,
            lineNumbers: 'on',
            tabSize: 2,
            wordBasedSuggestions: 'off',
            selectOnLineNumbers: true,
            scrollBeyondLastLine: false,
            tabCompletion: 'on',
            minimap: { enabled: false },
            overviewRulerLanes: 0,
            fontFamily: 'Fira Code, monospace',
            fontWeight: '500',
            fontSize: 13,
            renderLineHighlight: 'none',
            wordWrap: 'on',
            scrollbar: {
              useShadows: false,
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            fixedOverflowWidgets: true,
            bracketPairColorization: {
              enabled: true,
            },
            // 'bracketPairColorization.enabled': false,
          }}
        />
      </CardBody>
    </CardRoot>
  );
};
