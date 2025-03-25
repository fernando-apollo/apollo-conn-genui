import { OasGen } from 'apollo-conn-gen';

import 'rc-tree/assets/index.css';
import { useEffect } from 'react';
import Tree, { TreeNodeProps } from 'rc-tree';
import { IoMdReturnRight } from 'react-icons/io';
import { FiFolderPlus } from 'react-icons/fi';
import {
  MdDataArray,
  MdDataObject,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { TbHttpGet } from 'react-icons/tb';
import { FaArrowTurnDown } from 'react-icons/fa6';
import { type IType } from 'apollo-conn-gen/oas';
import { useOasTree } from '@/hooks/useOasTree.ts';

export interface ISpecTreeProps {
  parser: OasGen;
  onChange: (paths: string[], schema: string) => void;
}

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

  // set initial state
  useEffect(() => {
    const paths: IType[] = Array.from(parser.paths.values());
    const data = paths.map((path: IType) => ({
      title: path.forPrompt(parser.context!).replace('[GET]', ''),
      key: path.path(),
      isLeaf: false,
      disableCheckbox: false,
      parent: undefined,
      className: 'container-node',
    }));

    setTreeData(data);
    setCheckedKeys({
      checked: [],
      halfChecked: [],
    });
  }, [parser]);

  return (
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
      /*filterTreeNode={(node: EventDataNode<Node>): boolean => {
                console.log('filter', node.key);
                return !node.disableCheckbox;
            }}*/
      onRightClick={selectAllScalars}
      icon={getIcon}
    />
  );
};

const getIcon = (props: TreeNodeProps) => {
  const path: string = (props.data?.key as string) ?? '';
  if (!path) return;
  if (!path.includes('>')) return <TbHttpGet color='rgb(0, 90, 175)' />;

  const key = path.substring(path.lastIndexOf('>') + 1);
  if (
    key.startsWith('res:') ||
    key.startsWith('prop:ref:') ||
    key.startsWith('ref:')
  )
    return <IoMdReturnRight color='rgb(176, 57, 0)' />;

  if (key.startsWith('obj:') || key.startsWith('comp:'))
    return <MdDataObject color='rgb(123, 0, 199)' />;

  if (key.startsWith('ref:') || key.startsWith('prop:ref:'))
    return <FaArrowTurnDown color='rgb(176, 57, 0)' />;

  if (props.isLeaf) return <MdKeyboardArrowRight color='red' />;

  if (key.startsWith('array:') || key.startsWith('prop:array:'))
    if (props.isLeaf) return <MdDataArray color='red' />;
    else return <MdDataArray color='rgb(176, 57, 0)' />;

  return <FiFolderPlus color='red' />;
};
