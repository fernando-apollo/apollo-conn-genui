import {
  CloseButton,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerTitle,
  IconButton,
  Portal,
  VStack,
} from '@chakra-ui/react';
import './App.css';
import 'allotment/dist/style.css';
import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import Header from '@/components/Header.tsx';
import { AllotmentLayout } from '@/components/AllotmentLayout';
import { DrawerRoot, DrawerTrigger } from './components/ui/drawer';
import { IoMdOptions } from 'react-icons/io';
import { Preferences } from './components/preferences/Preferences';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // useEffect(() => {
  //   console.log('[web] selectionPathsVisible', selectionPathsVisible);
  // });

  return (
    <DrawerRoot open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)}>
      <VStack style={{ flexGrow: 1 }}>
        <Header
          actions={[
            <DrawerTrigger asChild key={'toggle-drawer-action'}>
              <IconButton size='sm' colorPalette='brand' variant='solid'>
                <IoMdOptions />
              </IconButton>
            </DrawerTrigger>,
          ]}
        />
        <AllotmentLayout
        // schema={schema}
        // setSchema={setSchema}
        // paths={paths}
        // setPaths={setPaths}
        // tab={tab}
        // setTab={setTab}
        // selectionPathsVisible={selectionPathsVisible}
        // setSelectionPathsVisible={setSelectionPathsVisible}
        />
        <Footer />
      </VStack>
      <Portal>
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Generator Options</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <Preferences />
            </DrawerBody>
            <DrawerCloseTrigger asChild>
              <CloseButton size='sm' />
            </DrawerCloseTrigger>
          </DrawerContent>
        </DrawerPositioner>
      </Portal>
    </DrawerRoot>
  );
}

export default App;
