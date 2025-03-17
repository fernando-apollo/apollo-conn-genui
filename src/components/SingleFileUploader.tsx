import React, { useState } from 'react';
import { OasGen } from 'apollo-oas';
import { IType } from 'apollo-oas/oas/nodes/types';

const SingleFileUploader = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFile(file);
      const reader = new FileReader();

      reader.onload = async (reader) => {
        if (!reader.target?.result) {
          return;
        }

        const content = reader.target.result as ArrayBuffer;
        // const content = reader.target.result as string;
        // const gen = JsonGen.fromReader(content);
        // const schema = gen.generateSchema();

        const gen = await OasGen.fromData(content, { skipValidation: true });
        await gen.visit();

        // gen.context?.types.forEach((type) => {
        //   console.log(type);
        // });
        const paths = [
          'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:id',
          'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:name',
          'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:name',
        ];

        const schema = gen.generateSchema(paths);
        console.log(schema);

        const get: IType | undefined = gen.paths.values().next().value;
        console.log('get', (get! as Get).resultType?.path());
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <div className='input-group'>
        <input id='file' type='file' onChange={handleFileChange} />
      </div>
      {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}
    </>
  );
};

export default SingleFileUploader;
