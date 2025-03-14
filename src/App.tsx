import {Allotment} from 'allotment';
import {
  VStack,
  Heading,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@chakra-ui/react';

import './App.css';
import 'allotment/dist/style.css';
import {LuFolder} from 'react-icons/lu';
import {EditorWrapper} from '@/components/editor/EditorWrapper.tsx';
import {OasPanel} from '@/components/panels/OasPanel.tsx';
import {useAppState} from './hooks/useAppState';
import {JsonPanel} from "@/components/panels/JsonPanel.tsx";
import {useEffect} from "react";

function App() {
  const {schema, setSchema} = useAppState();

  useEffect(() => {
    console.log('schema >>>> ', schema);
  }, [schema])

  return (
    <VStack style={{flexGrow: 1}}>
      <Heading>Hello</Heading>
      <Allotment>
        <Allotment.Pane className='left-splitview-panel'>
          <TabsRoot
            defaultValue='oas'
            size='sm'
            style={{display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'scroll'}}
          >
            <TabsList>
              <TabsTrigger value='oas'>
                <LuFolder/>
                OAS
              </TabsTrigger>
              <TabsTrigger value='json'>
                <LuFolder/>
                JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value='oas' style={{flexGrow: 1}} pt={0}>
              <OasPanel key='oasPanel' onChange={setSchema}/>
            </TabsContent>
            <TabsContent value='json' style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
              <JsonPanel key={"jsonPanel"} onChange={setSchema}/>
            </TabsContent>
          </TabsRoot>
        </Allotment.Pane>
        <Allotment.Pane>
          <EditorWrapper value={schema} language={'graphql'}
                         title={"Connector schema"}
          />
        </Allotment.Pane>
      </Allotment>
    </VStack>
  );
}

export default App;
