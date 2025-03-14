import {CardRoot, CardHeader, Heading, CardBody} from '@chakra-ui/react';
import {useAppState} from '@/hooks/useAppState.ts';
import {OASSpecChooser} from '@/components/uploaders/OASSpecChooser.tsx';
import {OasSpecTree} from '@/components/tree/OasSpecTree.tsx';

interface IOasPanelProps {
  onChange: (schema: string) => void;
}

export const OasPanel = ({onChange}: IOasPanelProps) => {
  const {oasGen, handleOasFileChange} = useAppState();

  return (
    <CardRoot className="oas-panel-container" m={0} size='sm'>
      <CardHeader>
        <Heading>
          <OASSpecChooser onFileChange={handleOasFileChange}/>
        </Heading>
      </CardHeader>
      <CardBody>
        {oasGen && <OasSpecTree parser={oasGen} onChange={onChange}/>}
      </CardBody>
    </CardRoot>
  );
};
