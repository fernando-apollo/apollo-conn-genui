import {
  CardRoot,
  CardHeader,
  Heading,
  CardBody,
  Icon,
  HStack,
  Box,
  ClipboardTrigger,
} from '@chakra-ui/react';
import {Editor} from '@monaco-editor/react';
import {useTheme} from 'next-themes';
import {editor} from 'monaco-editor';
import {JSX, useState} from 'react';
import {IoMdInformationCircleOutline} from 'react-icons/io';
import {Tooltip} from '../ui/tooltip';
import {
  ClipboardIconButton,
  ClipboardRoot,
} from '../ui/clipboard';
import {MdOutlineWarningAmber} from "react-icons/md";
import {FaRegCheckCircle} from "react-icons/fa";

type IEditorProps = {
  value: string,
  language: string,
  title: string,
  info?: string,
  readOnly?: boolean,
  onEditorChange?: (value: string | undefined) => void,
  showValidation?: boolean,
  actions?: Array<JSX.Element>,
  collapsed?: boolean
};

export const EditorWrapper = ({
                                value,
                                language = 'graphql',
                                title,
                                info = '',
                                readOnly = true,
                                onEditorChange,
                                showValidation = true,
                                actions,
                                collapsed = false,
                              }: IEditorProps) => {
  const theme = useTheme();
  const [isInvalidValue, setIInvalidValue] = useState(false);

  /*
  // not needed for now, but we'll keep it here just in case
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    _: Monaco
  ) {
    editorRef.current = editor;
  }
*/

  const handleEditorValidation = (markers: editor.IMarker[]) => {
    if (showValidation)
      setIInvalidValue(markers.length > 0);
  }

  return (
    <CardRoot size='sm' variant='outline' style={{flex: 1}} border='0' ml={1}>
      <CardHeader pl={2} pt={2} pr={2} m={0} borderBottom={'1px solid'} borderColor='gray.200'>
        <HStack alignItems='center'>
          <Heading size={'md'}>{title}</Heading>
          {info && (
            <Tooltip content={info} aria-label={info}>
              <Icon size='md' color='gray.900'>
                <IoMdInformationCircleOutline/>
              </Icon>
            </Tooltip>
          )}
          <Box flex={1}/>
          {showValidation && isInvalidValue && <MdOutlineWarningAmber color='orange'/>}
          {showValidation && !isInvalidValue && <FaRegCheckCircle color='green'/>}
          <ClipboardRoot value={value}>
            <ClipboardTrigger asChild>
              <ClipboardIconButton size='xs' m={1} p={0}/>
            </ClipboardTrigger>
          </ClipboardRoot>
          {actions}
        </HStack>
      </CardHeader>
      <CardBody m={0} p={0} pt={4} style={{display: collapsed ? 'none' : 'block'}}>
        <Editor
          // onMount={handleEditorDidMount}
          theme={theme.resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          defaultLanguage={language}
          value={value}
          defaultValue={value}
          onChange={onEditorChange ? onEditorChange : () => {
          }}
          onValidate={handleEditorValidation}
          options={{
            readOnly,
            lineNumbers: 'on',
            tabSize: 2,
            wordBasedSuggestions: 'off',
            selectOnLineNumbers: true,
            scrollBeyondLastLine: true,
            tabCompletion: 'on',
            minimap: {enabled: false},
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
