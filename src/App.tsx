import {Allotment} from 'allotment';
import {
  VStack,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  Box,
  Link,
  Text
} from '@chakra-ui/react';

import './App.css';
import 'allotment/dist/style.css';
import {LuFolder} from 'react-icons/lu';
import {EditorWrapper} from '@/components/editor/EditorWrapper.tsx';
import {OasPanel} from '@/components/panels/OasPanel.tsx';
import {useAppState} from './hooks/useAppState';
import {JsonPanel} from '@/components/panels/JsonPanel.tsx';
import Header from "@/components/Header.tsx";
import {Component} from "react";

class Footer extends Component {
  render() {
    return (
      <Box className='footer' fontFamily='p'>
        <Text textStyle='xs'>
          Built with ❤️ by the Solution Engineering Team @ Apollo &nbsp;
          (<Link
          href='https://www.apollographql.com/docs/graphos/reference/feature-launch-stages#experimental'>experimental
        </Link>)
        </Text>
      </Box>);
  }
}

function App() {
  const {schema, setSchema} = useAppState();

  return (
    <VStack style={{flexGrow: 1}}>
      <Header/>
      <Allotment>
        <Allotment.Pane className='left-splitview-panel'>
          <TabsRoot className='main-tabs-panel' defaultValue='oas' size='sm' pt={3} mr={1}>
            <TabsList>
              <TabsTrigger value='oas'><LuFolder/> OAS</TabsTrigger>
              <TabsTrigger value='json'><LuFolder/> JSON</TabsTrigger>
            </TabsList>
            <TabsContent value='oas' className='oas-tab-content' pt={0} m={0}>
              <OasPanel key='oasPanel' onChange={setSchema}/>
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
      <Footer/>
    </VStack>
  );
}

export default App;
