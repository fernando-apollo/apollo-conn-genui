import {
  CardRoot,
  CardHeader,
  Heading,
  CardBody,
  HStack,
} from '@chakra-ui/react';
import { OASSpecChooser } from '@/components/uploaders/OASSpecChooser.tsx';
import { OasSpecTree } from '@/components/tree/OasSpecTree.tsx';
import { useEffect, useState } from 'react';
import { FileChangeDetails } from '@zag-js/file-upload';

import { useAppState } from '@/hooks/useAppState.tsx';
import { OasGen } from 'apollo-conn-gen';
import { WaitCircle } from '../progress/indicators';

interface IOasPanelProps {
  onChange: (paths: string[], schema: string) => void;
}

export const OasPanel = ({ onChange }: IOasPanelProps) => {
  const { oasGen, setOasGen, setFileName, setSchema /*handleOasFileChange*/ } =
    useAppState();

  const [working, setWorking] = useState<boolean>(false);

  useEffect(() => {
    console.log('[web] spec changed', oasGen?.title(), oasGen?.paths.values());
  }, [oasGen]);

  const handleOasFileChange: (e: FileChangeDetails) => void = (
    e: FileChangeDetails
  ) => {
    const file = e.acceptedFiles[0];
    if (file) {
      setWorking(true);
      console.log('[web] working...');

      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = async (reader) => {
        if (!reader.target?.result) {
          return;
        }

        const content = reader.target.result as ArrayBuffer;
        try {
          const gen = await OasGen.fromData(content, { skipValidation: true });
          await gen.visit();

          setOasGen(gen);
          setSchema('');
        } finally {
          setWorking(false);
          console.log('[web] stopped working.');
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    // TODO: change this for VSTack
    <CardRoot
      className='oas-panel-container'
      m={0}
      p={0}
      style={{ flex: 1 }}
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
          {working && <WaitCircle />}
          <OASSpecChooser onFileChange={handleOasFileChange} />
        </HStack>
      </CardHeader>
      <CardBody m={0} p='2'>
        {oasGen && <OasSpecTree parser={oasGen} onChange={onChange} />}
      </CardBody>
    </CardRoot>
  );
};
