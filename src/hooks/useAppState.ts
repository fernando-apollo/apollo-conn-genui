import { useState } from 'react';
import { FileChangeDetails } from '@zag-js/file-upload';
import { OasGen } from 'apollo-oas';

export const useAppState = () => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [oasGen, setOasGen] = useState<OasGen | null>(null);
  const [schema, setSchema] = useState('//hello');

  const handleOasFileChange: (e: FileChangeDetails) => void = (
    e: FileChangeDetails
  ) => {
    const file = e.acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (reader) => {
        if (!reader.target?.result) {
          return;
        }

        const content = reader.target.result as ArrayBuffer;
        const gen = await OasGen.fromData(content, { skipValidation: true });
        await gen.visit();

        setOasGen(gen);
        setSchema('');
      };

      reader.readAsText(file);
    }
  };

  return {
    oasGen,
    handleOasFileChange,
    fileName,
    schema,
    setSchema,
  };
};
