import { OasGen } from 'apollo-conn-gen';

import 'rc-tree/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import Tree, { TreeNodeProps } from 'rc-tree';
import { IoMdReturnLeft, IoMdReturnRight } from 'react-icons/io';
import { FiFolderPlus } from 'react-icons/fi';
import {
  MdDataArray,
  MdDataObject,
  MdKeyboardArrowRight,
  MdOutlineSearch,
} from 'react-icons/md';
import { TbHttpGet, TbHttpPost } from 'react-icons/tb';
import { FaArrowTurnDown } from 'react-icons/fa6';
import { type IType } from 'apollo-conn-gen/oas';
import { useOasTree } from '@/hooks/useOasTree.ts';
import { createListCollection, HStack, Input, VStack } from '@chakra-ui/react';
import { InputGroup } from '../ui/input-group';
import { CloseButton } from '../ui/close-button';
import { NativeSelectField, NativeSelectRoot } from '../ui/native-select';
import _ from 'lodash';
import { useDebounce } from '@/hooks/useDebounce';

export interface ISpecTreeProps {
  parser: OasGen;
  onChange: (paths: string[], schema: string) => void;
}

const examples = createListCollection({
  items: [
    { label: "Contains 'Id' (ignores case)", value: '.*[iI][dD]}' },
    { label: "Ending with 'Id' (ignores case)", value: '.*[iI][dD]}$' },
  ],
});

export const OasSpecTree = ({ parser, onChange }: ISpecTreeProps) => {
  const {
    treeData,
    setTreeData,
    checkedKeys,
    setCheckedKeys,
    onLoadData,
    onCheck,
    selectAllScalars,
  } = useOasTree(parser, onChange);

  const [filter, setFilter] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const loadPaths = () => {
    let paths: IType[] = Array.from(parser.paths.values());

    if (filter && filter.length > 0) {
      const regexp = new RegExp(filter, 'ig');
      paths = paths.filter((path: IType) =>
        regexp.test(path.forPrompt(parser.context!))
      );
    }

    const data = paths.map((path: IType) => {
      return {
        title: _.truncate(
          path.forPrompt(parser.context!).replace(/\[(GET|POST)\]/i, ''),
          {
            length: 80,
          }
        ),
        key: path.path(),
        isLeaf: false,
        disableCheckbox: false,
        parent: undefined,
        className: 'container-node',
      };
    });

    setTreeData(data);
    setCheckedKeys({
      checked: [],
      halfChecked: [],
    });
  };

  // set initial state
  useEffect(() => {
    loadPaths();
  }, [parser]);

  const debouncedSearch = useDebounce({
    callback: () => loadPaths(),
  });

  return (
    <VStack alignItems='stretch'>
      <HStack>
        <InputGroup
          flex={2}
          startElement={<MdOutlineSearch />}
          endElement={
            <CloseButton
              size='xs'
              onClick={() => {
                setFilter('');
                inputRef.current?.focus();
                debouncedSearch();
              }}
              me='-2'
            />
          }
        >
          <Input
            size='xs'
            placeholder='Enter a regexp to filter the path list'
            onChange={(e) => {
              setFilter(e.target.value);
              debouncedSearch();
            }}
            value={filter}
            ref={inputRef}
            fontFamily='Fira Code'
          />
        </InputGroup>
        <NativeSelectRoot size='sm' flex='1'>
          <NativeSelectField
            placeholder='Examples...'
            items={examples.items}
            onChange={(e) => {
              setFilter(e.target.value);
              debouncedSearch();
            }}
          />
        </NativeSelectRoot>
      </HStack>
      <Tree
        key={parser.title()}
        style={{ height: '100%' }}
        treeData={treeData}
        checkable
        checkedKeys={checkedKeys}
        selectable={false}
        loadData={onLoadData}
        onCheck={onCheck}
        checkStrictly={true}
        expandAction='click'
        showLine={true}
        onRightClick={selectAllScalars}
        icon={getIcon}
      />
    </VStack>
  );
};

const getIcon = (props: TreeNodeProps) => {
  const path: string = (props.data?.key as string) ?? '';
  if (!path) return;

  if (path.startsWith('get:') && !path.includes('>'))
    return <TbHttpGet color='rgb(0, 90, 175)' />;

  if (path.startsWith('post:') && !path.includes('>'))
    return <TbHttpPost color='rgb(175, 90, 0)' />;

  const key = path.substring(path.lastIndexOf('>') + 1);
  if (key.startsWith('prop:ref:') || key.startsWith('ref:'))
    return <IoMdReturnRight color='rgb(176, 57, 0)' />;

  if (key.startsWith('res:')) return <IoMdReturnLeft color='rgb(176, 57, 0)' />;

  if (key.startsWith('body:'))
    return <IoMdReturnRight color='rgb(176, 57, 0)' />;

  if (
    key.startsWith('obj:') ||
    key.startsWith('comp:') ||
    key.startsWith('union:')
  )
    return <MdDataObject color='rgb(123, 0, 199)' />;

  if (key.startsWith('ref:') || key.startsWith('prop:ref:'))
    return <FaArrowTurnDown color='rgb(176, 57, 0)' />;

  if (props.isLeaf) return <MdKeyboardArrowRight color='red' />;

  if (key.startsWith('array:') || key.startsWith('prop:array:'))
    if (props.isLeaf) return <MdDataArray color='red' />;
    else return <MdDataArray color='rgb(176, 57, 0)' />;

  return <FiFolderPlus color='red' />;
};
