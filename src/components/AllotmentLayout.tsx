import { Allotment } from 'allotment';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@chakra-ui/react';
import { LuFolder } from 'react-icons/lu';
import { JsonEditor } from '@/components/editor/EditorWrapper';
import { OasPanel } from '@/components/panels/OasPanel';
import { JsonPanel } from '@/components/panels/JsonPanel';
import { SelectionPaths } from '@/components/SelectionPaths';
import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/useAppState.tsx';
import { ConnectorEditor } from './editor/ConnectorEditor';

export const AllotmentLayout = () => {
  const { oasGen, schema, setSchema } = useAppState();

  const [tab, setTab] = useState<string | null>('oas');
  const [paths, setPaths] = useState<string[]>([]);
  const [selectionPanelVisible, setSelectionPanelVisible] = useState(false);

  useEffect(() => {
    console.log('[web] parser changed');
    setPaths([]);
  }, [oasGen]);

  return (
    <Allotment
      vertical={true}
      defaultSizes={[400, 100]}
      onVisibleChange={(index, visible) => {
        console.log('[web] onVisibleChange', index, visible);
        if (index === 1) {
          setSelectionPanelVisible(visible);
        }
      }}
    >
      <Allotment.Pane>
        <Allotment>
          <Allotment.Pane className='left-splitview-panel'>
            <TabsRoot
              className='main-tabs-panel'
              defaultValue='oas'
              size='sm'
              pt={3}
              mr={1}
              onValueChange={(e) => setTab(e.value)}
            >
              <TabsList>
                <TabsTrigger value='oas'>
                  <LuFolder /> OAS
                </TabsTrigger>
                <TabsTrigger value='json'>
                  <LuFolder /> JSON
                </TabsTrigger>
              </TabsList>
              <TabsContent value='oas' className='oas-tab-content' pt={0} m={0}>
                <OasPanel
                  key='oasPanel'
                  paths={paths}
                  onChange={(paths, schema) => {
                    setPaths(paths);
                    setSchema(schema);
                  }}
                />
              </TabsContent>
              <TabsContent
                value='json'
                className='json-tab-content'
                pt={0}
                m={0}
              >
                <JsonPanel key={'jsonPanel'} onChange={setSchema} />
              </TabsContent>
            </TabsRoot>
          </Allotment.Pane>
          <Allotment.Pane>
            <ConnectorEditor
              value={schema}
              showValidation={true}
              info='The connector schema will appear in the editor below'
              title={'Connector schema'}
            />
          </Allotment.Pane>
        </Allotment>
      </Allotment.Pane>
      {tab === 'oas' && (
        <Allotment.Pane
          snap
          className='bottom-splitview-panel'
          visible={selectionPanelVisible}
          maxSize={selectionPanelVisible ? 56 : Infinity}
        >
          <SelectionPaths
            paths={paths}
            onChange={setSchema}
            onCollapse={() => {
              console.log('onCollapse');
              setSelectionPanelVisible(false);
            }}
          />
        </Allotment.Pane>
      )}
    </Allotment>
  );
};
