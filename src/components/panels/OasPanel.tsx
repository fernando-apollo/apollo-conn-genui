import {
  CardRoot,
  CardHeader,
  Heading,
  CardBody,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { OASSpecChooser } from '@/components/uploaders/OASSpecChooser.tsx';
import { OasSpecTree } from '@/components/tree/OasSpecTree.tsx';
import { useEffect, useState } from 'react';
import { FileChangeDetails } from '@zag-js/file-upload';

import { useAppState } from '@/hooks/useAppState.tsx';
import { OasGen } from 'apollo-conn-gen';
import { WaitCircle } from '../progress/indicators';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { defaultPreferences, Preferences } from '../preferences/Preferences';
import { MdRefresh } from 'react-icons/md';
import _ from 'lodash';
import { Alert } from '../ui/alert';
import { CloseButton } from '../ui/close-button';

interface IOasPanelProps {
  paths: string[];
  onChange: (paths: string[], schema: string) => void;
}

export const OasPanel = ({ paths = [], onChange }: IOasPanelProps) => {
  const {
    oasGen,
    setOasGen,
    fileName,
    setFileName,
    setSchema,
    /*handleOasFileChange*/
  } = useAppState();

  const [_preferences, _setPreferences, getLatestPreferences] =
    useLocalStorage<Preferences>('user-preferences', defaultPreferences);

  const [working, setWorking] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    console.log('[web] spec changed', oasGen?.title(), oasGen?.paths.values());
    console.log('[web] paths', _.isEmpty(paths));
  }, [oasGen, paths]);

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
          const gen = await OasGen.fromData(content, {
            ...getLatestPreferences(),
          });

          await gen.visit();
          setOasGen(gen);
          setSchema('');
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : String(err));
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
          <OASSpecChooser
            onFileChange={(e: FileChangeDetails) => {
              setError(undefined);
              return handleOasFileChange(e);
            }}
          />
          {!error && oasGen && (
            <IconButton
              disabled={_.isEmpty(paths)}
              variant='solid'
              colorPalette='brand'
              size='sm'
              onClick={() => {
                const latest = getLatestPreferences();
                oasGen.options = latest;
                oasGen!.context!.generatedSet.clear();
                console.log('[web] parsed paths', paths, 'preferences', latest);
                onChange(paths, oasGen.generateSchema(paths));
              }}
            >
              <MdRefresh />
            </IconButton>
          )}
        </HStack>
      </CardHeader>
      <CardBody m={0} p='2'>
        {error && (
          <Alert
            status='error'
            title={`Error parsing '${fileName}'`}
            children={error}
          />
        )}
        {!error && oasGen && (
          <OasSpecTree parser={oasGen} onChange={onChange} />
        )}
      </CardBody>
    </CardRoot>
  );
};
