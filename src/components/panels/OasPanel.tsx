import {
  CardRoot,
  CardHeader,
  Heading,
  CardBody,
  HStack,
} from '@chakra-ui/react';
import {OASSpecChooser} from '@/components/uploaders/OASSpecChooser.tsx';
import {OasSpecTree} from '@/components/tree/OasSpecTree.tsx';
import {useEffect} from 'react';

import {useAppState} from "@/hooks/useAppState.tsx";

interface IOasPanelProps {
  onChange: (paths: string[], schema: string) => void;
}

export const OasPanel = ({onChange}: IOasPanelProps) => {
  const {oasGen, handleOasFileChange} = useAppState();

  useEffect(() => {
    console.log('[web] spec changed', oasGen?.title());
  }, [oasGen]);

  return (
    // TODO: change this for VSTack
    <CardRoot
      className='oas-panel-container'
      m={0}
      p={0}
      style={{flex: 1}}
      size='sm'
      border='0'
    >
      <CardHeader m={0} p={2}>
        <HStack justifyContent='space-between'>
          {oasGen && (
            <Heading size='sm' flex='1' lineClamp='1'>
              {oasGen.title()} ({oasGen.version()})
            </Heading>
          )}
          <OASSpecChooser onFileChange={handleOasFileChange}/>
        </HStack>
      </CardHeader>
      <CardBody m={0} p='2'>
        {oasGen && <OasSpecTree parser={oasGen} onChange={onChange}/>}
      </CardBody>
    </CardRoot>
  );
};
