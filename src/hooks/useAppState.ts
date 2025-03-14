import {useState} from 'react';
import {FileChangeDetails} from '@zag-js/file-upload';
import {OasGen} from "apollo-oas";

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
        const gen = await OasGen.fromData(content, {skipValidation: true});
        await gen.visit();

        setOasGen(gen);
        setSchema('')
      };

      reader.readAsText(file);
    }
  };

  /*
    const handleJsonChange: (e: FileChangeDetails) => void = (
      e: FileChangeDetails
    ) => {
      console.log('json changed');
      const file = e.acceptedFiles[0];
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = async (reader) => {
          if (!reader.target?.result) {
            return;
          }

          const content = reader.target.result;
          const walker = JsonGen.fromReader(content as string);
          setJsonGen(walker);
          const generateSchema = walker.generateSchema();
          console.log("generateSchema");
          setSchema(generateSchema)
        };

        setSchema('// json')
        reader.readAsText(file);
      }

    }
  */

  return {
    oasGen,
    handleOasFileChange,
    fileName,
    schema,
    setSchema,
  };
};

/*
import { JsonGen, OasGen } from 'apollo-oas';
import { useState } from 'react';
import { FileChangeDetails } from '@zag-js/file-upload';

type AppState = {
  oasGen: OasGen | null;
  setOasGen: (oasGen: OasGen) => void;
  jsonGen: JsonGen | null;
  setJsonGen: (jsonGen: JsonGen) => void;
  handleOasFileChange: (e: FileChangeDetails) => void;
  handleJsonChange: (e: FileChangeDetails, callback: (schema: string) => void) => void;
  fileName: string | undefined;
  schema: string;
  setSchema: (schema: string) => void;
};

export const useAppState = (): AppState => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [oasGen, setOasGen] = useState<OasGen | null>(null);
  const [jsonGen, setJsonGen] = useState<JsonGen | null>(null);
  const [schema, setSchema] = useState('');

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

        setSchema('');
        setOasGen(gen);
      };

      reader.readAsText(file);
    }
  };

  const handleJsonChange: (e: FileChangeDetails, cb: (schema: string) => void) => void = (
    e: FileChangeDetails
  ) => {
    console.log('json changed');
    const file = e.acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (reader) => {
        if (!reader.target?.result) {
          return;
        }

        const content = reader.target.result;
        const gen = JsonGen.fromReader(content as string);

        setJsonGen(gen);
        cb(gen.generateSchema());
        // setSchema(gen.generateSchema());
      };

      reader.readAsText(file);
    }
  };

  return {
    oasGen,
    jsonGen,
    fileName,
    schema,
    setOasGen,
    setJsonGen,
    setSchema,
    handleOasFileChange,
    handleJsonChange,
  };
};
*/
