import { CardRoot, CardHeader, Heading, CardBody } from '@chakra-ui/react';
import { useAppState } from '@/hooks/useAppState.ts';
import { OASSpecChooser } from '@/components/uploaders/OASSpecChooser.tsx';
import { OasSpecTree } from '@/components/tree/OasSpecTree.tsx';

interface IOasPanelProps {
  onChange: (schema: string) => void;
}

export const OasPanel = ({ onChange }: IOasPanelProps) => {
  const { oasGen, handleOasFileChange } = useAppState();

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
      <CardHeader>
        <Heading>
          <OASSpecChooser onFileChange={handleOasFileChange} />
        </Heading>
      </CardHeader>
      <CardBody>
        {oasGen && <OasSpecTree parser={oasGen} onChange={onChange} />}
      </CardBody>
    </CardRoot>
  );
};
