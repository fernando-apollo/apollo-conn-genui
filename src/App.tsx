import {Allotment} from 'allotment';
import {Box, Link, TabsContent, TabsList, TabsRoot, TabsTrigger, Text, VStack} from '@chakra-ui/react';

import './App.css';
import 'allotment/dist/style.css';
import {LuFolder} from 'react-icons/lu';
import {EditorWrapper} from '@/components/editor/EditorWrapper.tsx';
import {OasPanel} from '@/components/panels/OasPanel.tsx';
import {JsonPanel} from '@/components/panels/JsonPanel.tsx';
import Header from "@/components/Header.tsx";
import {Component, useEffect, useState} from "react";
import {SelectionPaths} from "@/components/SelectionPaths.tsx";

import {useAppState} from "@/hooks/useAppState.tsx";

class Footer extends Component {
  render() {
    return (
      <Box className='footer' fontFamily='p'>
        <Text textStyle='xs'>
          Built with ❤️ by the Solution Engineering Team @ Apollo &nbsp;
          (<Link target='_blank'
                 href='https://www.apollographql.com/docs/graphos/reference/feature-launch-stages#experimental'>experimental
        </Link>)
        </Text>
      </Box>);
  }
}

function App() {
  // const {oasGen, schema, setSchema} = useAppState();
  const [paths, setPaths] = useState<string[]>([]);
  const [tab, setTab] = useState<string | null>("oas")

  const {schema, setSchema} = useAppState()
  const [selectionPathsVisible, setSelectionPathsVisible] = useState(false);

  useEffect(() => {
    console.log('[web] selectionPathsVisible', selectionPathsVisible);
  })

  return (
    <VStack style={{flexGrow: 1}}>
      <Header/>
      <Allotment vertical={true} defaultSizes={[400, 100]}
                 onVisibleChange={(index, visible) => {
                    console.log('[web] onVisibleChange', index, visible);
                    if (index === 1) {
                      setSelectionPathsVisible(visible);
                    }
                 }}
        >
        <Allotment.Pane>
          <Allotment>
            <Allotment.Pane className='left-splitview-panel'>
              <TabsRoot className='main-tabs-panel' defaultValue='oas' size='sm' pt={3} mr={1}
                        onValueChange={(e) => setTab(e.value)}>
                <TabsList>
                  <TabsTrigger value='oas'><LuFolder/> OAS</TabsTrigger>
                  <TabsTrigger value='json'><LuFolder/> JSON</TabsTrigger>
                </TabsList>
                <TabsContent value='oas' className='oas-tab-content' pt={0} m={0}>
                  <OasPanel key='oasPanel' onChange={(paths, schema) => {
                    setPaths(paths);
                    setSchema(schema);
                  }}/>
                </TabsContent>
                <TabsContent value='json' className="json-tab-content" pt={0} m={0}>
                  <JsonPanel key={'jsonPanel'} onChange={setSchema}/>
                </TabsContent>
              </TabsRoot>
            </Allotment.Pane>
            <Allotment.Pane>
              <EditorWrapper
                value={schema}
                showValidation={false}
                language={'graphql'}
                info='The connector schema will appear in the editor below'
                title={'Connector schema'}
              />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        {tab === 'oas' &&
            <Allotment.Pane snap className="bottom-splitview-panel"
                            visible={selectionPathsVisible}
                            maxSize={selectionPathsVisible ? 56 : Infinity}>
                <SelectionPaths paths={paths} onChange={setSchema} onCollapse={() => {
                  console.log('onCollapse');
                  setSelectionPathsVisible(false);
                }}/>
            </Allotment.Pane>
        }
      </Allotment>
      <Footer/>
    </VStack>
  );
}

export default App;
