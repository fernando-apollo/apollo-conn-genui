import { OasGen } from 'apollo-conn-gen';

import 'rc-tree/assets/index.css';
import { Key, useEffect, useRef, useState, useCallback } from 'react';
import Tree, { TreeNodeProps } from 'rc-tree';
import { IoMdReturnLeft, IoMdReturnRight } from 'react-icons/io';

import {
  MdCircle,
  MdDataArray,
  MdDataObject,
  MdKeyboardArrowRight,
  MdOutlineSearch,
  MdQuestionMark,
} from 'react-icons/md';
import {
  TbHttpDelete,
  TbHttpGet,
  TbHttpPatch,
  TbHttpPost,
  TbHttpPut,
} from 'react-icons/tb';
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
    setSelectedPaths,
  } = useOasTree(parser, onChange);

  const [filter, setFilter] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  const loadPaths = useCallback(() => {
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
          path
            .forPrompt(parser.context!)
            .replace(/\[(GET|POST|PUT|PATCH|DELETE)\]/i, ''),
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
    setSelectedPaths([]);
    setTreeData(data);
    // setExpandedKeys([]);
    setCheckedKeys({
      checked: [],
      halfChecked: [],
    });
  }, [
    parser.paths,
    parser.context,
    filter,
    setSelectedPaths,
    setTreeData,
    setCheckedKeys,
  ]);

  // set initial state
  useEffect(() => {
    // setExpandedKeys([]);
    loadPaths();
  }, [loadPaths]);

  const debouncedSearch = useDebounce({
    callback: () => {
      console.log('[web] expandedKeys', expandedKeys);
      return loadPaths();
    },
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
              // setExpandedKeys([]);
              setFilter(e.target.value);
              debouncedSearch();
            }}
          />
        </NativeSelectRoot>
      </HStack>
      <Tree
        key={parser.title() + treeData.length}
        style={{ height: '100%' }}
        treeData={treeData}
        checkable
        checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        selectable={false}
        loadData={onLoadData}
        checkStrictly={true}
        expandAction='click'
        showLine={true}
        onRightClick={selectAllScalars}
        icon={getIcon}
        defaultExpandedKeys={expandedKeys}
        defaultCheckedKeys={checkedKeys?.checked}
        onExpand={setExpandedKeys}
        defaultExpandAll={true}
        defaultExpandParent={true}
        autoExpandParent={true}
        onCheck={(checked, info) =>
          onCheck(checked, info as unknown as React.MouseEvent)
        }
      />
    </VStack>
  );
};

const getIcon = (props: TreeNodeProps) => {
  const path: string = (props.data?.key as string) ?? '';
  if (!path) return;

  if (path.startsWith('get:') && !path.includes('>'))
    return <TbHttpGet color='#61affe' />;

  if (path.startsWith('post:') && !path.includes('>'))
    return <TbHttpPost color='#49cc90' />;

  if (path.startsWith('put:') && !path.includes('>'))
    return <TbHttpPut color='#fca130' />;

  if (path.startsWith('patch:') && !path.includes('>'))
    return <TbHttpPatch color='rgb(175, 90, 0)' />;

  if (path.startsWith('del:') && !path.includes('>'))
    return <TbHttpDelete color='#f93e3e' />;

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
    if (props.isLeaf) return <MdCircle color='red' />;
    else return <MdDataArray color='rgb(176, 57, 0)' />;

  if (key.startsWith('scalar:'))
    return <MdKeyboardArrowRight color='rgb(176, 57, 0)' />;

  return <MdQuestionMark color='red' />;
};
