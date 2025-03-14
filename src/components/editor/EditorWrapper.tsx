import {CardRoot, CardHeader, Heading, CardBody} from '@chakra-ui/react';
import {Editor} from '@monaco-editor/react';
import {useTheme} from 'next-themes';

type IEditorProps = {
  value: string,
  language: string,
  title: string
};

export const EditorWrapper = ({
                                value,
                                language = 'graphql',
                                title
                              }: IEditorProps) => {
  const theme = useTheme();

  return (
    <CardRoot m={2} style={{height: '99%'}} size='sm' variant='outline'>
      <CardHeader>
        <Heading>{title}</Heading>
      </CardHeader>
      <CardBody>
        <Editor
          theme={theme.resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          defaultLanguage={language}
          value={value}
          options={{
            readOnly: true,
            lineNumbers: 'on',
            tabSize: 2,
            wordBasedSuggestions: 'off',
            selectOnLineNumbers: true,
            scrollBeyondLastLine: false,
            tabCompletion: 'on',
            minimap: {enabled: false},
            overviewRulerLanes: 0,
            fontFamily: 'Fira Code, monospace',
            fontSize: 12,
            renderLineHighlight: 'none',
            wordWrap: 'on',
            scrollbar: {
              useShadows: false,
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            fixedOverflowWidgets: true,
            'bracketPairColorization.enabled': false,
          }}
        />
      </CardBody>
    </CardRoot>
  );
};
