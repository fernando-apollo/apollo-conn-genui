import { FileUploadFileChangeDetails } from '@chakra-ui/react';
import { JsonGen } from 'apollo-conn-gen';
import { useState } from 'react';

export type UploadedFile = {
  name: string;
  content: string;
};

export const useUploadState = () => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onFileChange = (e: FileUploadFileChangeDetails): void => {
    const file = e.acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (reader) => {
        if (!reader.target?.result) {
          return;
        }

        const content = reader.target.result as string;

        // todo:
        // const walker = JsonGen.fromReader(content);
        // const generateSchema = walker.generateSchema();
        // onChange(generateSchema);

        setFileName(file.name);
        // setJson(content);
        setUploadedFiles([{ name: file.name, content }]);
      };

      reader.readAsText(file);
    }
  };

  const onFolderChange = (e: FileUploadFileChangeDetails): void => {
    const jsonGen = JsonGen.new();

    async function loadFilesSequentially(files: File[]) {
      const processed: UploadedFile[] = [];

      for (const file of files) {
        const content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            jsonGen.walkJson(event.target?.result as string);
            resolve(event.target?.result);
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });

        processed.push({ name: file.name, content: content as string });
      }

      return processed;
    }

    loadFilesSequentially(e.acceptedFiles)
      .then((files) => {
        console.log('All files loaded sequentially:', files);
        // todo:
        // onChange(jsonGen.generateSchema());
        setFileName(files[0].name);
        // setJson(files[0].content);
        setUploadedFiles(files);
      })
      .catch((error) => {
        console.error('Error loading files:', error);
      });
  };

  return {
    fileName,
    setFileName,
    onFileChange,
    onFolderChange,
    uploadedFiles,
    setUploadedFiles,
  };
};
