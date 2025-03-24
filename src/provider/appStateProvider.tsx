import {ReactNode, useState} from 'react';
import {OasGen} from "apollo-conn-gen";
import {FileChangeDetails} from "@zag-js/file-upload";
import { AppContext } from '../context/appContext.ts';


export const AppStateProvider = ({children}: { children: ReactNode }) => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [oasGen, setOasGen] = useState<OasGen | null>(null);
  const [schema, setSchema] = useState("");

  const handleOasFileChange: (e: FileChangeDetails) => void = (
    e: FileChangeDetails,
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
        setSchema("");
      };

      reader.readAsText(file);
    }
  };

  return (
    <AppContext.Provider value={{schema, setSchema, oasGen, handleOasFileChange, fileName, setFileName}}>
      {children}
    </AppContext.Provider>
  );
};

