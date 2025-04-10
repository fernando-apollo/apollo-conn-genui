import { ReactNode, useState } from 'react';
import { OasGen } from 'apollo-conn-gen';
import { AppContext } from '../context/appContext.ts';

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [oasGen, setOasGen] = useState<OasGen | null>(null);
  const [schema, setSchema] = useState('');

  return (
    <AppContext.Provider
      value={{
        schema,
        setSchema,
        oasGen,
        setOasGen,
        fileName,
        setFileName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
