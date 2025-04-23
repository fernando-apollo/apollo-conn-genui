import { CardBody, CardRoot, IconButton } from '@chakra-ui/react';
import { HiChevronDoubleDown } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { IoMdColorWand } from 'react-icons/io';
import { JsonEditor } from '@/components/editor/EditorWrapper.tsx';

import { useAppState } from '@/hooks/useAppState.tsx';

interface ISelectionPathsProps {
  paths: string[];
  onChange: (schema: string) => void;
  onCollapse?: (collapsed: boolean) => void;
}

export const SelectionPaths = (
  { paths, onChange, onCollapse }: ISelectionPathsProps = {
    paths: [],
    onChange: () => {},
  }
) => {
  const { oasGen } = useAppState();
  const [parsedPaths, setParsedPaths] = useState<string[]>();

  useEffect(() => {
    setParsedPaths([...paths]);
  }, [paths]);

  useEffect(() => {
    console.log('[web] spec changed');
    setParsedPaths([]);
  }, [oasGen]);

  return (
    <>
      <CardRoot flex='1' m={2} p={0} size='sm'>
        <CardBody display={'flex'} m={0} p={2} pt={0}>
          <JsonEditor
            info={
              'The editor below shows the current OAS selection and allows you to edit the paths and try out different selections. Use the Wand icon on the right hand side to generate a schema.'
            }
            readOnly={false}
            value={JSON.stringify(parsedPaths, null, 2)}
            language='json'
            title='Selection Paths'
            onEditorChange={(value) => {
              setParsedPaths(JSON.parse(value || '[]') || []);
            }}
            actions={[
              <IconButton
                key='magic-wand-editor-button'
                variant='subtle'
                aria-label='Generate schema for contents'
                size='xs'
                onClick={() => {
                  console.log('[web] on magic wand', oasGen);
                  if (!oasGen) return;

                  oasGen!.context?.generatedSet.clear();
                  console.log('[web] parsed paths', parsedPaths);
                  onChange(oasGen!.generateSchema(parsedPaths) ?? '');
                }}
              >
                <IoMdColorWand />
              </IconButton>,
              <IconButton
                key='collapse-editor-button'
                size='xs'
                variant='subtle'
                onClick={() => {
                  if (onCollapse) onCollapse(true);
                }}
              >
                <HiChevronDoubleDown />
              </IconButton>,
            ]}
          />
        </CardBody>
      </CardRoot>
    </>
  );
};
