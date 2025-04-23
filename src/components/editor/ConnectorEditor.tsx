import * as monaco from 'monaco-editor';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Tooltip } from '../ui/tooltip';
import { ClipboardIconButton, ClipboardRoot } from '../ui/clipboard';
import { MdOutlineWarningAmber } from 'react-icons/md';
import { FaRegCheckCircle } from 'react-icons/fa';

import {
  languageId,
  registerApolloGraphQLLanguage,
} from 'register-apollo-graphql-language';

import packageJson from '../../../package.json';

// import {
//   STUDIO_THEME_EDITABLE_DARK,
//   studioThemeEditableDark,
// } from './studioThemeEditableDark';

// Pull this out so we can still enforce a type here. The type of the prop
// is the more general IEditorConstructionOptions
export const DEFAULT_MONACO_OPTIONS:
  | monaco.editor.IStandaloneEditorConstructionOptions
  | monaco.editor.IDiffEditorConstructionOptions = {
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
  'semanticHighlighting.enabled': true,
  formatOnPaste: true,
  formatOnType: true,
  bracketPairColorization: {
    enabled: true,
  },
  lineNumbers: 'on',
};

function getParams(): {
  version: 'local' | 'deployed';
  composition: boolean;
  connectors: boolean;
} {
  const searchParams = new URLSearchParams(window.location.search);
  const version = searchParams.get('version') ?? 'deployed';
  const composition = (searchParams.get('composition') ?? 'true') === 'true';
  const connectors = (searchParams.get('connectors') ?? 'true') === 'true';
  switch (version) {
    case 'deployed':
    case 'local':
      return { version, composition, connectors };
    default:
      return { version: 'local', composition, connectors };
  }
}
const params = getParams();

registerApolloGraphQLLanguage({
  version:
    params.version === 'deployed'
      ? (packageJson.apolloLanguageServerVersion as Parameters<
          typeof registerApolloGraphQLLanguage
        >[0]['version'])
      : 'local',
  enableDebugLogging: true,
  enableAutoComposition: params.composition,
  forceFederation: false,
  handleWorkerTimeout: (reject) => reject(new Error('Timeout loading worker')),
  onException: (err) => {
    throw new Error(err);
  },
});

type IEditorProps = {
  value: string;
  title: string;
  info?: string;
  readOnly?: boolean;
  onEditorChange?: (value: string | undefined) => void;
  showValidation?: boolean;
  actions?: Array<JSX.Element>;
};

export const ConnectorEditor = ({
  value,
  title,
  info,
  onEditorChange,
  showValidation = true,
  actions,
}: IEditorProps) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isInvalidValue, setIsInvalidValue] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    monaco.editor.IMarker[]
  >([]);

  const handleEditorValidation = useCallback(
    (markers: monaco.editor.IMarker[]) => {
      if (showValidation) {
        setIsInvalidValue(markers.length > 0);
        setValidationErrors(markers);
      }
    },
    [showValidation]
  );

  const handleEditorChange = useCallback(() => {
    if (editorRef.current && onEditorChange) {
      const currentValue = editorRef.current.getValue();
      onEditorChange(currentValue);
    }
  }, [onEditorChange]);

  useEffect(() => {
    if (!divRef.current) throw new Error('missing div');

    try {
      const defaultModel = monaco.editor.createModel(value, languageId);
      const editor = monaco.editor.create(divRef.current, {
        ...DEFAULT_MONACO_OPTIONS,
        automaticLayout: true,
        model: defaultModel,
        language: languageId,
      });

      editorRef.current = editor;

      // Add event listeners
      const disposable = editor.onDidChangeModelContent(handleEditorChange);
      const validationDisposable = editor.onDidChangeModelDecorations(() => {
        const markers = monaco.editor.getModelMarkers({
          resource: editor.getModel()?.uri,
        });
        handleEditorValidation(markers);
      });

      // Initial validation
      const initialMarkers = monaco.editor.getModelMarkers({
        resource: defaultModel.uri,
      });
      handleEditorValidation(initialMarkers);

      return () => {
        disposable.dispose();
        validationDisposable.dispose();
        editor.dispose();
        defaultModel.dispose();
      };
    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error);
      throw error;
    }
  }, [divRef, handleEditorChange, handleEditorValidation]);

  // Add new useEffect to handle value updates
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== value) {
        // Prevent triggering onChange when we're setting the value
        const model = editorRef.current.getModel();
        if (model) {
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: value,
              },
            ],
            () => null
          );

          // Format the document after setting the value
          editorRef.current.getAction('editor.action.formatDocument')?.run();

          // Trigger validation after setting the value
          const markers = monaco.editor.getModelMarkers({
            resource: model.uri,
          });
          handleEditorValidation(markers);
        }
      }
    }
  }, [value, handleEditorValidation]);

  return (
    <CardRoot size='sm' variant='outline' style={{ flex: 1 }} border='0' ml={1}>
      <CardHeader
        pl={2}
        pt={2}
        pr={2}
        m={0}
        borderBottom={'1px solid'}
        borderColor='gray.200'
      >
        <HStack alignItems='center'>
          <Heading size={'md'}>{title}</Heading>
          {info && (
            <Tooltip content={info} aria-label={info}>
              <Icon size='md' color='gray.900'>
                <IoMdInformationCircleOutline />
              </Icon>
            </Tooltip>
          )}
          <Box flex={1} />
          {showValidation && isInvalidValue && (
            <Tooltip
              content={validationErrors
                .map((error) => error.message)
                .join('\n')}
              aria-label='Validation errors'
            >
              <Icon as={MdOutlineWarningAmber} color='orange' />
            </Tooltip>
          )}
          {showValidation && !isInvalidValue && (
            <Icon as={FaRegCheckCircle} color='green' />
          )}
          <ClipboardRoot value={value}>
            <ClipboardTrigger asChild>
              <ClipboardIconButton size='xs' m={1} p={0} />
            </ClipboardTrigger>
          </ClipboardRoot>
          {actions}
        </HStack>
      </CardHeader>
      <CardBody
        m={0}
        p={0}
        pt={4}
        pb={2}
        style={{
          display: 'flex',
          height: 'calc(100% - 48px)',
        }}
      >
        <Box
          className='Editor'
          ref={divRef}
          style={{
            flex: 1,
          }}
        />
      </CardBody>
    </CardRoot>
  );
};
