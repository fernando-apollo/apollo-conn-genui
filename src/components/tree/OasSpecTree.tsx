import { OasGen } from 'apollo-conn-gen';

import 'rc-tree/assets/index.css';
import { EventDataNode, Key } from 'rc-tree/lib/interface';
import { useEffect, useState } from 'react';
import Tree, { TreeNodeProps } from 'rc-tree';
import { type IType } from 'apollo-conn-gen/oas';
import { Composed } from 'apollo-conn-gen/oas';
import { Union } from 'apollo-conn-gen/oas';
import { Type } from 'apollo-conn-gen/oas';
import { Ref } from 'apollo-conn-gen/oas';
import { VscArrowSmallRight } from 'react-icons/vsc';
// import { RxSwitch } from 'react-icons/rx';
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';

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
  // const writer: Writer = new Writer(parser);

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
      disableCheckbox: !isScalarOrEnum,
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

  const onCheck = (values: Key[] | CheckedProps): void => {
    const set = new Set<string>();

    // add all the parent nodes from the checked nodes
    // needed for the backend to generate the answers
    // TODO:
    if (typeof values === 'object') {
      const checkedProps: CheckedProps = values as CheckedProps;
      setCheckedKeys({
        checked: [...checkedProps.checked, ...set],
        halfChecked: checkedProps.halfChecked,
      });

      const paths = checkedProps.checked as string[];

      // reset generated state
      parser.context?.generatedSet.clear();
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
        checked: [...checkedKeys?.checked, ...keys!],
        halfChecked: checkedKeys.halfChecked,
      });
    }
  };

  // set initial state
  useEffect(() => {
    const paths: IType[] = Array.from(parser.paths.values());
    const data = paths.map((path: IType) => ({
      title: path.forPrompt(parser.context!),
      key: path.path(),
      isLeaf: false,
      disableCheckbox: true,
      parent: undefined,
      className: 'container-node',
    }));

    setTreeData(data);
  }, [parser]);

  const getIconFor = (data: TreeNodeProps) => {
    if (!data.isLeaf)
      return data.expanded ? (
        <IoMdArrowDropright style={{ color: '#15252d' }} />
      ) : (
        <IoMdArrowDropdown style={{ color: '#15252d' }} />
      );
    else return <VscArrowSmallRight style={{ color: '#fc5200' }} />;
  };

  return (
    <Tree
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
      switcherIcon={(props: TreeNodeProps) => getIconFor(props)}
      showIcon={false}
      // icon={(_props: TreeNodeProps) => <RxSwitch />}
    />
  );
};
