import { OasGen } from 'apollo-conn-gen';

import 'rc-tree/assets/index.css';
import { EventDataNode, Key } from 'rc-tree/lib/interface';
import { useEffect, useState } from 'react';
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
import { type IType, Composed, Union, Type, Ref } from 'apollo-conn-gen/oas';
import _ from 'lodash';

interface ISpecTreeProps {
  parser: OasGen;
  onChange: (schema: string) => void;
}

type CheckedProps = {
  checked: Key[];
  halfChecked: Key[];
};

export type Node = {
  title: string;
  key: string;
  isLeaf: boolean;
  children?: Node[];
  parent?: Node;
  disableCheckbox?: boolean;
  checked?: boolean;
  className?: string;
};

type TreeData = Node[];

export const OasSpecTree = ({ parser, onChange }: ISpecTreeProps) => {
  const [treeData, setTreeData] = useState<TreeData>([]);
  const types: IType[] = Array.from(parser.paths.values());

  const [checkedKeys, setCheckedKeys] = useState<CheckedProps>({
    checked: [],
    halfChecked: [],
  });

  function expandType(type?: IType): IType[] {
    if (!type) {
      return types;
    }

    let result: IType[] = [];

    if (type instanceof Composed || type instanceof Union) {
      // make sure we gather all the props
      (type as Composed | Union).consolidate([]);

      result = Array.from(type.props.values());
    } else {
      // top level paths
      result = parser.expand(type);

      if (result.length === 1) {
        // we are checking for a ref so we can go straight to where its pointing
        const child = result[0];

        if (!(child as Type).visited) {
          child.visit(parser.context!);
        }

        if (child instanceof Ref) {
          result = [child.refType!];
        }
      }
    }

    return result;
  }

  const findNode = (
    items: Node[] | undefined,
    key: string
  ): Node | undefined => {
    if (!items) {
      return;
    }

    for (const item of items) {
      if (item.key === key) {
        return item;
      }

      // Test children recursively
      const child: Node | undefined = findNode(item.children, key);
      if (child) {
        return child;
      }
    }
  };

  const createNode = (item: IType, root: Node | undefined): Node => {
    const isScalarOrEnum =
      item.id.startsWith('prop:scalar') || item.id.startsWith('enum:');

    const result = {
      title: item.forPrompt(parser.context!),
      key: item.path(),
      isLeaf: isScalarOrEnum,
      // disableCheckbox: !isScalarOrEnum,
      disableCheckbox: item.id.startsWith('res:'),
      parent: root,
      className: isScalarOrEnum ? 'container-node' : 'leaf-node',
    };

    return result;
  };

  const findPath = (path: string): IType | boolean => {
    let collection: IType[] = Array.from(parser.paths.values());
    let current: IType | undefined;
    let last: IType | undefined;

    let i = 0;
    const parts = path.split('>');
    do {
      const part = parts[i].replace(/#\/c\/s/g, '#/components/schemas');
      current = collection.find((t) => t.id === part);
      if (!current) {
        throw new Error(
          'Could not find type: ' +
            part +
            ' from ' +
            path +
            ', last: ' +
            last?.pathToRoot()
        );
      }

      // make sure we expand it before we move on to the next part
      parser.expand(current);
      last = current;

      collection =
        Array.from(current!.children.values()) ||
        Array.from(current!.props.values()) ||
        [];

      i++;
    } while (i < parts.length);

    return current;
  };

  const onLoadData = async ({ key }: Node) => {
    const newTreeData: TreeData = [...treeData];
    const treeNode = findNode(newTreeData, key);

    let result: IType[] = [];
    if (!treeNode?.parent) {
      const typeNode = findPath(key); // parser.find(key, types);
      if (typeNode) result = expandType(typeNode as IType);
    } else {
      const typeNode = findPath(key); // parser.findPath(key); // findPath(key);
      if (typeNode) result = expandType(typeNode as IType);
    }

    const children = treeNode?.children?.map((c) => c.key) || [];
    result
      .filter((i) => !children.includes(i.path()))
      .forEach((item: IType) => {
        const newNode: Node = createNode(item, treeNode);

        if (treeNode) {
          treeNode.isLeaf = false;
          if (treeNode.children) {
            treeNode.children.push(newNode);
          } else {
            treeNode.children = [newNode];
          }
        }
      });

    setTreeData(newTreeData);
    await undefined;
  };

  const convert = (p: string): string => {
    // get last path
    const last = p.substring(p.lastIndexOf('>') + 1);
    return '';
  };

  const onCheck = (values: Key[] | CheckedProps): void => {
    const set = new Set<string>();
    console.log('[web] onCheck', typeof values, values);

    // add all the parent nodes from the checked nodes
    // needed for the backend to generate the answers
    // TODO:
    if (typeof values === 'object') {
      const checkedProps: CheckedProps = values as CheckedProps;

      // do we have a GET node?
      const gets = checkedProps.checked.map((p) => convert(p as string));

      checkedProps.checked
        .map((p) => findNode(treeData, p as string))
        .forEach((n: Node | undefined) => {
          set.add(n?.key as string);

          let p = n;
          while ((p = p?.parent)) {
            set.add(p.key);
          }
        });

      setCheckedKeys({
        checked: [...set],
        halfChecked: checkedProps.halfChecked,
      });

      const paths = checkedProps.checked as string[];

      // reset generated state
      parser.context?.generatedSet.clear();
      console.log('paths', paths);
      onChange(parser.generateSchema(paths));
    }
  };

  const getId = (key: string) => key.substring(key.lastIndexOf('>') + 1);

  const selectAllScalars = (info: {
    event: React.MouseEvent;
    node: EventDataNode<Node>;
  }) => {
    console.log('right click', info.event, info.node);
    const n = findNode(treeData, info.node.key);
    if (!n) return;

    const id = n.key.substring(n.key.lastIndexOf('>') + 1);

    if (id.startsWith('obj:') || id.startsWith('comp:')) {
      const keys: Key[] | undefined = n.children
        ?.filter((n: Node) => getId(n.key as string).startsWith('prop:scalar'))
        .map((c) => c.key);

      onCheck({
        // eslint-disable-next-line no-unsafe-optional-chaining
        checked: [...checkedKeys?.checked, ...keys!],
        halfChecked: checkedKeys.halfChecked,
      });
    }
  };

  // set initial state
  useEffect(() => {
    const paths: IType[] = Array.from(parser.paths.values());
    const data = paths.map((path: IType) => ({
      title: path.forPrompt(parser.context!).replace('[GET]', ''),
      key: path.path(),
      isLeaf: false,
      // disableCheckbox: true,
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
      // filterTreeNode={(node: Node) => {
      //   console.log('filter', node.key);
      //   return !node.disableCheckbox;
      // }}
      onRightClick={selectAllScalars}
      icon={(props: TreeNodeProps) => {
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
      }}
    />
  );
};
